import { checkRateLimit, getRateLimitHeaders } from "../rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows requests under the limit", () => {
    const result = checkRateLimit("test-id", { maxRequests: 5, windowMs: 60000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over the limit", () => {
    const config = { maxRequests: 2, windowMs: 60000 };
    checkRateLimit("test-id", config);
    checkRateLimit("test-id", config);
    const result = checkRateLimit("test-id", config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const config = { maxRequests: 1, windowMs: 60000 };
    checkRateLimit("test-id", config);
    jest.advanceTimersByTime(61000);
    const result = checkRateLimit("test-id", config);
    expect(result.allowed).toBe(true);
  });
});

describe("getRateLimitHeaders", () => {
  it("returns correct header shape", () => {
    const result = {
      allowed: true,
      remaining: 42,
      resetTime: Date.now() + 60000,
    };
    const headers = getRateLimitHeaders(result);
    expect(headers["X-RateLimit-Limit"]).toBe("100");
    expect(headers["X-RateLimit-Remaining"]).toBe("42");
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });
});
