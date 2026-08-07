import { describe, it, expect, beforeEach, vi } from "vitest";
import { isRateLimited, recordAttempt, clearAttempts } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("is not rate limited before any attempts are recorded", () => {
    const key = `test-${Math.random()}`;
    expect(isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("becomes rate limited once the limit is reached", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) recordAttempt(key, 60_000);
    expect(isRateLimited(key, 5, 60_000)).toBe(true);
  });

  it("stays under the limit while below the threshold", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 4; i++) recordAttempt(key, 60_000);
    expect(isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("clearAttempts resets the counter", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) recordAttempt(key, 60_000);
    expect(isRateLimited(key, 5, 60_000)).toBe(true);
    clearAttempts(key);
    expect(isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("resets the window once it has expired", () => {
    vi.useFakeTimers();
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) recordAttempt(key, 1000);
    expect(isRateLimited(key, 5, 1000)).toBe(true);

    vi.advanceTimersByTime(1500);
    expect(isRateLimited(key, 5, 1000)).toBe(false);

    recordAttempt(key, 1000);
    expect(isRateLimited(key, 5, 1000)).toBe(false);
    vi.useRealTimers();
  });
});
