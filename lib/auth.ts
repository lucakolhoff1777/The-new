import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt, clearAttempts } from "@/lib/rateLimit";
import { verifyTotpToken } from "@/lib/twoFactor";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
        token: { label: "2FA-Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const rateLimitKey = `login:${email}`;

        if (isRateLimited(rateLimitKey, LOGIN_ATTEMPT_LIMIT, LOGIN_ATTEMPT_WINDOW_MS)) {
          throw new Error(
            "Zu viele fehlgeschlagene Anmeldeversuche. Bitte in 15 Minuten erneut versuchen."
          );
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { practice: true },
        });
        if (!user) {
          recordAttempt(rateLimitKey, LOGIN_ATTEMPT_WINDOW_MS);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          recordAttempt(rateLimitKey, LOGIN_ATTEMPT_WINDOW_MS);
          return null;
        }

        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.token) {
            throw new Error("2FA_REQUIRED");
          }
          const tokenValid = await verifyTotpToken(credentials.token, user.totpSecret);
          if (!tokenValid) {
            recordAttempt(rateLimitKey, LOGIN_ATTEMPT_WINDOW_MS);
            throw new Error("2FA_INVALID");
          }
        }

        clearAttempts(rateLimitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          practiceId: user.practiceId,
          practiceName: user.practice.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.practiceId = (user as any).practiceId;
        token.practiceName = (user as any).practiceName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).practiceId = token.practiceId;
        (session.user as any).practiceName = token.practiceName;
      }
      return session;
    },
  },
};
