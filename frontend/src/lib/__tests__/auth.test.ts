import { getClientIP } from "../auth";

describe("getClientIP", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    });
    expect(getClientIP(request)).toBe("192.168.1.1");
  });

  it("falls back to x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.5" },
    });
    expect(getClientIP(request)).toBe("10.0.0.5");
  });

  it("returns unknown when no headers present", () => {
    const request = new Request("http://localhost");
    expect(getClientIP(request)).toBe("unknown");
  });
});
