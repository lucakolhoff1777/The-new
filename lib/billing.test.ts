import { describe, it, expect } from "vitest";
import { estimateAmountCent, kassenLabel, STANDARD_GOZ_PUNKTWERT_CENT } from "./billing";

const practiceWithBoth = { gozPunktwertCent: STANDARD_GOZ_PUNKTWERT_CENT, bemaPunktwertCent: 1.1 };
const practiceWithNeither = { gozPunktwertCent: null, bemaPunktwertCent: null };

describe("estimateAmountCent", () => {
  it("returns null when punktzahl is missing and no Festbetrag is set", () => {
    const item = { system: "GOZ", punktzahl: null, festbetragCent: null };
    expect(estimateAmountCent(item, 2.3, 1, practiceWithBoth)).toBeNull();
  });

  it("returns null for GOZ when the practice hasn't entered a Punktwert", () => {
    const item = { system: "GOZ", punktzahl: 100, festbetragCent: null };
    expect(estimateAmountCent(item, 2.3, 1, practiceWithNeither)).toBeNull();
  });

  it("computes GOZ amount as punktzahl * punktwert * faktor * quantity", () => {
    const item = { system: "GOZ", punktzahl: 100, festbetragCent: null };
    const result = estimateAmountCent(item, 2.3, 1, practiceWithBoth);
    expect(result).toBe(Math.round(100 * STANDARD_GOZ_PUNKTWERT_CENT * 2.3));
  });

  it("defaults faktor to 1 when not given for GOZ/GOÄ", () => {
    const item = { system: "GOAE", punktzahl: 100, festbetragCent: null };
    const result = estimateAmountCent(item, null, 1, practiceWithBoth);
    expect(result).toBe(Math.round(100 * STANDARD_GOZ_PUNKTWERT_CENT));
  });

  it("multiplies by quantity", () => {
    const item = { system: "GOZ", punktzahl: 100, festbetragCent: null };
    const result = estimateAmountCent(item, 1, 3, practiceWithBoth);
    expect(result).toBe(Math.round(100 * STANDARD_GOZ_PUNKTWERT_CENT * 3));
  });

  it("computes BEMA amount without applying any faktor", () => {
    const item = { system: "BEMA", punktzahl: 50, festbetragCent: null };
    const result = estimateAmountCent(item, 2.3, 1, practiceWithBoth);
    // faktor 2.3 must be ignored for BEMA
    expect(result).toBe(Math.round(50 * 1.1));
  });

  it("returns null for BEMA when the practice hasn't entered its regional Punktwert", () => {
    const item = { system: "BEMA", punktzahl: 50, festbetragCent: null };
    expect(estimateAmountCent(item, null, 1, practiceWithNeither)).toBeNull();
  });

  it("uses Festbetrag directly when set, ignoring punktzahl/punktwert entirely", () => {
    const item = { system: "BEL_II", punktzahl: null, festbetragCent: 12345 };
    const result = estimateAmountCent(item, null, 2, practiceWithNeither);
    expect(result).toBe(12345 * 2);
  });

  it("does not compute an amount for SONSTIGES items", () => {
    const item = { system: "SONSTIGES", punktzahl: null, festbetragCent: null };
    expect(estimateAmountCent(item, null, 1, practiceWithBoth)).toBeNull();
  });
});

describe("kassenLabel", () => {
  it("labels BEMA as a GKV-Leistung", () => {
    expect(kassenLabel("BEMA").tone).toBe("gkv");
  });

  it("labels GOZ and GOÄ as Privatleistung/IGEL", () => {
    expect(kassenLabel("GOZ").tone).toBe("privat");
    expect(kassenLabel("GOAE").tone).toBe("privat");
  });

  it("labels BEL_II as Laborkosten", () => {
    expect(kassenLabel("BEL_II").tone).toBe("labor");
  });

  it("labels anything else as neutral / not separately billed", () => {
    expect(kassenLabel("SONSTIGES").tone).toBe("neutral");
  });
});
