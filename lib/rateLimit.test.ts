import { describe, it, expect, beforeEach, vi } from "vitest";
import { isRateLimited, recordAttempt, clearAttempts } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("is not rate limited before any attempts are recorded", async () => {
    const key = `test-${Math.random()}`;
    expect(await isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("becomes rate limited once the limit is reached", async () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) await recordAttempt(key, 60_000);
    expect(await isRateLimited(key, 5, 60_000)).toBe(true);
  });

  it("stays under the limit while below the threshold", async () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 4; i++) await recordAttempt(key, 60_000);
    expect(await isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("clearAttempts resets the counter", async () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) await recordAttempt(key, 60_000);
    expect(await isRateLimited(key, 5, 60_000)).toBe(true);
    await clearAttempts(key);
    expect(await isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("resets the window once it has expired", async () => {
    vi.useFakeTimers();
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) await recordAttempt(key, 1000);
    expect(await isRateLimited(key, 5, 1000)).toBe(true);

    vi.advanceTimersByTime(1500);
    expect(await isRateLimited(key, 5, 1000)).toBe(false);

    await recordAttempt(key, 1000);
    expect(await isRateLimited(key, 5, 1000)).toBe(false);
    vi.useRealTimers();
  });
});
