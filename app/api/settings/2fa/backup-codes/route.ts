import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBackupCodes } from "@/lib/twoFactor";

// Regeneriert die Backup-Codes (z. B. weil alte verbraucht/verloren wurden).
// Ersetzt die alte Liste vollständig - vorherige Codes werden ungültig.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.totpEnabled) {
    return NextResponse.json({ error: "2FA ist nicht aktiv." }, { status: 400 });
  }

  const { plain: backupCodes, hashesJoined } = await generateBackupCodes();
  await prisma.user.update({ where: { id: user.id }, data: { totpBackupCodes: hashesJoined } });

  return NextResponse.json({ backupCodes });
}
