import { generateSecret, generate, verify, generateURI } from "otplib";
import QRCode from "qrcode";

const ISSUER = "Zahnarzt Berichte";

export function createTotpSecret(): string {
  return generateSecret();
}

export async function totpQrDataUrl(email: string, secret: string): Promise<string> {
  const uri = generateURI({ issuer: ISSUER, label: email, secret });
  return QRCode.toDataURL(uri);
}

export async function verifyTotpToken(token: string, secret: string): Promise<boolean> {
  try {
    const result = await verify({ secret, token: token.trim() });
    return result.valid;
  } catch {
    return false;
  }
}

// Nur für Tests/Diagnose - erzeugt den aktuell gültigen Code zu einem Secret.
export async function currentTotpToken(secret: string): Promise<string> {
  return generate({ secret });
}
