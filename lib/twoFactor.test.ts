import { describe, it, expect } from "vitest";
import { generateBackupCodes, consumeBackupCode } from "@/lib/twoFactor";

describe("generateBackupCodes", () => {
  it("erzeugt 10 eindeutige Codes im Format XXXX-XXXX", async () => {
    const { plain, hashesJoined } = await generateBackupCodes();

    expect(plain).toHaveLength(10);
    expect(new Set(plain).size).toBe(10);
    for (const code of plain) {
      expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    }
    expect(hashesJoined.split(",")).toHaveLength(10);
  });
});

describe("consumeBackupCode", () => {
  it("akzeptiert einen gültigen Code und entfernt ihn aus der verbleibenden Liste", async () => {
    const { plain, hashesJoined } = await generateBackupCodes();
    const target = plain[3];

    const remaining = await consumeBackupCode(target, hashesJoined);

    expect(remaining).not.toBeNull();
    expect(remaining!.split(",")).toHaveLength(9);
  });

  it("ist case-insensitive (Kleinbuchstaben werden akzeptiert)", async () => {
    const { plain, hashesJoined } = await generateBackupCodes();
    const target = plain[0].toLowerCase();

    const remaining = await consumeBackupCode(target, hashesJoined);

    expect(remaining).not.toBeNull();
  });

  it("lehnt einen unbekannten Code ab", async () => {
    const { hashesJoined } = await generateBackupCodes();

    const remaining = await consumeBackupCode("ZZZZ-ZZZZ", hashesJoined);

    expect(remaining).toBeNull();
  });

  it("lehnt denselben Code beim zweiten Versuch ab (Einmalnutzung)", async () => {
    const { plain, hashesJoined } = await generateBackupCodes();
    const target = plain[5];

    const afterFirstUse = await consumeBackupCode(target, hashesJoined);
    const afterSecondUse = await consumeBackupCode(target, afterFirstUse);

    expect(afterSecondUse).toBeNull();
  });

  it("gibt null zurück, wenn keine Backup-Codes hinterlegt sind", async () => {
    const remaining = await consumeBackupCode("ABCD-EFGH", null);
    expect(remaining).toBeNull();
  });
});
