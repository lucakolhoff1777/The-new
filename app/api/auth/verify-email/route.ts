import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

const schema = z.object({ token: z.string().min(1) });

// Bewusst POST statt GET, damit E-Mail-Scanner/Link-Previews (die GET-Links
// automatisch abrufen) die Verifikation nicht versehentlich verbrauchen -
// dieselbe Überlegung wie bei reset-password/accept-invite.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const verification = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });

  if (!verification || verification.usedAt || verification.expiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Der Link ist ungültig oder abgelaufen. Bitte eine neue Bestätigungs-E-Mail anfordern." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: verification.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.emailVerificationToken.update({ where: { id: verification.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
