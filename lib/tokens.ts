import crypto from "crypto";

// Gemeinsames Muster für alle Einmal-Link-Tokens (Passwort-Reset,
// Team-Einladung, E-Mail-Verifizierung): ein zufälliger Rohwert geht per
// Link an die Person, gespeichert wird nur der SHA-256-Hash - ein DB-Leak
// gibt damit keine gültigen Links preis.
export function generateToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}
