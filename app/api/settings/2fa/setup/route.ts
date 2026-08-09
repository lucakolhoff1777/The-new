import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTotpSecret, totpQrDataUrl } from "@/lib/twoFactor";

// Erzeugt ein neues (noch nicht aktives) TOTP-Secret und liefert einen
// QR-Code dafür zurück. Erst nach erfolgreicher Verifikation über
// /api/settings/2fa/enable wird totpEnabled=true gesetzt.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const secret = createTotpSecret();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: secret, totpEnabled: false },
  });

  const qrDataUrl = await totpQrDataUrl(user.email, secret);

  return NextResponse.json({ secret, qrDataUrl });
}
