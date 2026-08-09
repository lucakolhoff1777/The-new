import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

// Gemeinsame Admin-Prüfung für API-Routen, die praxisweite Einstellungen
// ändern (Abrechnung, Katalog, Team) statt reiner Tagesarbeit (Patienten,
// Berichte) - letztere bleiben für alle Praxismitglieder zugänglich.
export async function requireAdmin(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Diese Aktion ist nur für Admin-Konten der Praxis verfügbar." },
        { status: 403 }
      ),
    };
  }
  return { session, error: null };
}
