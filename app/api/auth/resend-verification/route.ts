import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/emailVerification";
import { isRateLimited, recordAttempt } from "@/lib/rateLimit";

const LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const rateLimitKey = `resend-verification:${session.user.id}`;
  if (await isRateLimited(rateLimitKey, LIMIT, WINDOW_MS)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 }
    );
  }
  await recordAttempt(rateLimitKey, WINDOW_MS);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  if (user.emailVerifiedAt) {
    return NextResponse.json({ error: "E-Mail-Adresse ist bereits bestätigt." }, { status: 400 });
  }

  await sendVerificationEmail(user);
  return NextResponse.json({ ok: true });
}
