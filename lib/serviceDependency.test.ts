import { describe, it, expect } from "vitest";
import {
  parseDependsOn,
  serializeDependsOn,
  computeEffectivePerformed,
} from "./serviceDependency";

describe("parseDependsOn / serializeDependsOn", () => {
  it("parses a comma-separated list, trimming whitespace and dropping empties", () => {
    expect(parseDependsOn("a, b ,,c")).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for null/undefined/empty input", () => {
    expect(parseDependsOn(null)).toEqual([]);
    expect(parseDependsOn(undefined)).toEqual([]);
    expect(parseDependsOn("")).toEqual([]);
  });

  it("round-trips through serializeDependsOn", () => {
    expect(serializeDependsOn(["a", "b"])).toBe("a,b");
    expect(serializeDependsOn([])).toBeNull();
  });
});

describe("computeEffectivePerformed", () => {
  it("an item with no dependencies just reflects its own toggle", () => {
    const items = [{ id: "a", dependsOn: [] }];
    expect(computeEffectivePerformed(items, { a: true })).toEqual({ a: true });
    expect(computeEffectivePerformed(items, { a: false })).toEqual({ a: false });
  });

  it("forces a dependent item to false when its prerequisite is struck", () => {
    const items = [
      { id: "root", dependsOn: [] },
      { id: "child", dependsOn: ["root"] },
    ];
    const result = computeEffectivePerformed(items, { root: false, child: true });
    expect(result.root).toBe(false);
    expect(result.child).toBe(false);
  });

  it("lets a dependent item be effectively performed once its prerequisite is", () => {
    const items = [
      { id: "root", dependsOn: [] },
      { id: "child", dependsOn: ["root"] },
    ];
    const result = computeEffectivePerformed(items, { root: true, child: true });
    expect(result.child).toBe(true);
  });

  it("uses OR semantics: any one satisfied prerequisite is enough", () => {
    const items = [
      { id: "a", dependsOn: [] },
      { id: "b", dependsOn: [] },
      { id: "child", dependsOn: ["a", "b"] },
    ];
    const result = computeEffectivePerformed(items, { a: false, b: true, child: true });
    expect(result.child).toBe(true);
  });

  it("cascades through multiple levels of a chain", () => {
    const items = [
      { id: "trepanation", dependsOn: [] },
      { id: "aufbereitung", dependsOn: ["trepanation"] },
      { id: "fuellung", dependsOn: ["aufbereitung"] },
    ];
    const result = computeEffectivePerformed(items, {
      trepanation: false,
      aufbereitung: true,
      fuellung: true,
    });
    expect(result.trepanation).toBe(false);
    expect(result.aufbereitung).toBe(false);
    expect(result.fuellung).toBe(false);
  });

  it("does not infinite-loop on a dependency cycle and resolves to false", () => {
    const items = [
      { id: "a", dependsOn: ["b"] },
      { id: "b", dependsOn: ["a"] },
    ];
    const result = computeEffectivePerformed(items, { a: true, b: true });
    expect(result.a).toBe(false);
    expect(result.b).toBe(false);
  });

  it("treats a reference to an unknown item id as unsatisfied", () => {
    const items = [{ id: "child", dependsOn: ["missing"] }];
    const result = computeEffectivePerformed(items, { child: true });
    expect(result.child).toBe(false);
  });
});
