import { describe, it, expect } from "vitest";
import { isAmountMatch, manualMatchReceiptToInvoice } from "../src/lib/services/invoice-matcher";

describe("Invoice Matching Engine", () => {
  describe("isAmountMatch", () => {
    it("should match exact amounts", () => {
      expect(isAmountMatch(1000, 1000, 0.01)).toBe(true);
    });

    it("should match within tolerance", () => {
      expect(isAmountMatch(1000.01, 1000, 0.01)).toBe(true);
      expect(isAmountMatch(999.99, 1000, 0.01)).toBe(true);
    });

    it("should reject amounts outside tolerance", () => {
      expect(isAmountMatch(1100, 1000, 0.01)).toBe(false);
      expect(isAmountMatch(900, 1000, 0.01)).toBe(false);
    });

    it("should handle zero invoice amount", () => {
      expect(isAmountMatch(100, 0, 0.01)).toBe(false);
    });

    it("should use default 1% tolerance", () => {
      expect(isAmountMatch(1005, 1000)).toBe(true);
      expect(isAmountMatch(1020, 1000)).toBe(false);
    });
  });

  describe("manualMatchReceiptToInvoice", () => {
    it("should throw error for non-existent receipt", async () => {
      await expect(
        manualMatchReceiptToInvoice("invalid-id", "invalid-id")
      ).rejects.toThrow("Receipt not found");
    });
  });
});
