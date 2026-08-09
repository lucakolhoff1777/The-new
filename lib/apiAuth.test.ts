import { describe, it, expect } from "vitest";
import { generateApiKey, hashApiKey, apiKeyPrefix } from "./apiAuth";

describe("generateApiKey", () => {
  it("produces a key with the expected prefix and sufficient length", () => {
    const key = generateApiKey();
    expect(key).toMatch(/^zbk_live_[0-9a-f]{64}$/);
  });

  it("produces a different key on every call", () => {
    expect(generateApiKey()).not.toBe(generateApiKey());
  });
});

describe("hashApiKey", () => {
  it("is deterministic for the same input", () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).toBe(hashApiKey(key));
  });

  it("produces different hashes for different keys", () => {
    expect(hashApiKey(generateApiKey())).not.toBe(hashApiKey(generateApiKey()));
  });

  it("never stores the raw key in the hash", () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).not.toContain(key);
  });
});

describe("apiKeyPrefix", () => {
  it("returns a short, stable prefix for display purposes", () => {
    const key = generateApiKey();
    const prefix = apiKeyPrefix(key);
    expect(key.startsWith(prefix)).toBe(true);
    expect(prefix.length).toBeLessThan(key.length);
  });
});
