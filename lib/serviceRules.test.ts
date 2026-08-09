import { describe, it, expect } from "vitest";
import { validateFaktor, findExclusionConflicts, validateGueltigkeit } from "./serviceRules";

const STANDARD_FAKTOR = {
  faktorMin: 1.0,
  faktorMax: 3.5,
  regelhoechstfaktor: 2.3,
  begruendungspflichtAbFaktor: 2.3,
};

describe("validateFaktor", () => {
  it("allows a missing faktor (nothing to validate)", () => {
    expect(validateFaktor(null, null, STANDARD_FAKTOR, "Test")).toBeNull();
    expect(validateFaktor(undefined, undefined, STANDARD_FAKTOR, "Test")).toBeNull();
  });

  it("rejects a faktor below the minimum", () => {
    const error = validateFaktor(0.5, null, STANDARD_FAKTOR, "Eingehende Untersuchung");
    expect(error).toMatch(/Minimum/);
  });

  it("rejects a faktor above the maximum", () => {
    const error = validateFaktor(4.0, null, STANDARD_FAKTOR, "Eingehende Untersuchung");
    expect(error).toMatch(/Maximum/);
  });

  it("allows a faktor at or below the Regelhöchstfaktor without a Begründung", () => {
    expect(validateFaktor(2.3, null, STANDARD_FAKTOR, "Test")).toBeNull();
    expect(validateFaktor(1.8, null, STANDARD_FAKTOR, "Test")).toBeNull();
  });

  it("requires a Begründung once the faktor exceeds the Regelhöchstfaktor", () => {
    const error = validateFaktor(2.8, null, STANDARD_FAKTOR, "Eingehende Untersuchung");
    expect(error).toMatch(/Begründung/);
    expect(error).toMatch(/erforderlich/);
  });

  it("accepts a faktor above the Regelhöchstfaktor once a Begründung is given", () => {
    expect(validateFaktor(2.8, "Erschwerte Bedingungen.", STANDARD_FAKTOR, "Test")).toBeNull();
  });

  it("treats a whitespace-only Begründung as missing", () => {
    const error = validateFaktor(2.8, "   ", STANDARD_FAKTOR, "Test");
    expect(error).toMatch(/Begründung/);
  });

  it("falls back to regelhoechstfaktor when begruendungspflichtAbFaktor is not set", () => {
    const rules = { ...STANDARD_FAKTOR, begruendungspflichtAbFaktor: null };
    const error = validateFaktor(2.8, null, rules, "Test");
    expect(error).toMatch(/Begründung/);
  });
});

describe("findExclusionConflicts", () => {
  it("finds a mutually exclusive pair that is both performed", () => {
    const itemsById = new Map([
      ["a", { id: "a", title: "Füllung, einflächig", ausschlussMit: ["b"] }],
      ["b", { id: "b", title: "Füllung, mehrflächig", ausschlussMit: ["a"] }],
    ]);
    const conflicts = findExclusionConflicts(["a", "b"], itemsById);
    expect(conflicts).toHaveLength(1);
    expect([conflicts[0].a.id, conflicts[0].b.id].sort()).toEqual(["a", "b"]);
  });

  it("reports no conflict when only one of a pair is performed", () => {
    const itemsById = new Map([
      ["a", { id: "a", title: "Füllung, einflächig", ausschlussMit: ["b"] }],
      ["b", { id: "b", title: "Füllung, mehrflächig", ausschlussMit: ["a"] }],
    ]);
    expect(findExclusionConflicts(["a"], itemsById)).toHaveLength(0);
  });

  it("does not report the same pair twice", () => {
    const itemsById = new Map([
      ["a", { id: "a", title: "A", ausschlussMit: ["b"] }],
      ["b", { id: "b", title: "B", ausschlussMit: ["a"] }],
    ]);
    const conflicts = findExclusionConflicts(["a", "b"], itemsById);
    expect(conflicts).toHaveLength(1);
  });

  it("ignores items with no exclusion rules", () => {
    const itemsById = new Map([
      ["a", { id: "a", title: "A", ausschlussMit: [] }],
      ["b", { id: "b", title: "B", ausschlussMit: [] }],
    ]);
    expect(findExclusionConflicts(["a", "b"], itemsById)).toHaveLength(0);
  });
});

describe("validateGueltigkeit", () => {
  const par2021 = { gueltigAb: new Date("2021-07-01"), gueltigBis: null };

  it("skips the check when no treatment date is given", () => {
    expect(validateGueltigkeit(null, par2021, "PAR-Position")).toBeNull();
  });

  it("rejects a treatment date before gueltigAb", () => {
    const error = validateGueltigkeit(new Date("2019-01-01"), par2021, "PAR-Position");
    expect(error).toMatch(/erst ab dem/);
  });

  it("accepts a treatment date on or after gueltigAb", () => {
    expect(validateGueltigkeit(new Date("2022-01-01"), par2021, "PAR-Position")).toBeNull();
  });

  it("rejects a treatment date after gueltigBis", () => {
    const rules = { gueltigAb: null, gueltigBis: new Date("2020-12-31") };
    const error = validateGueltigkeit(new Date("2021-01-01"), rules, "Alte Position");
    expect(error).toMatch(/nur bis zum/);
  });
});
