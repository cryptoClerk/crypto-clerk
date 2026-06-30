import { isValidTxHash } from "../../app/api/receipts/route";

// Test the validation helper (need to export it from route first)
describe("isValidTxHash", () => {
  it("accepts valid Ethereum tx hashes", () => {
    expect(isValidTxHash("0xabc123def4567890123456789012345678901234567890123456789012345678")).toBe(true);
    expect(isValidTxHash("0xABCDEF1234567890123456789012345678901234567890123456789012345678")).toBe(true);
    expect(isValidTxHash("0x0000000000000000000000000000000000000000000000000000000000000000")).toBe(true);
  });

  it("rejects invalid tx hashes", () => {
    expect(isValidTxHash("")).toBe(false);
    expect(isValidTxHash("not-a-hash")).toBe(false);
    expect(isValidTxHash("0x123")).toBe(false);
    expect(isValidTxHash("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")).toBe(false);
    expect(isValidTxHash("0xabc123def456789012345678901234567890123456789012345678901234567")).toBe(false); // 63 chars
    expect(isValidTxHash("0xabc123def45678901234567890123456789012345678901234567890123456789")).toBe(false); // 65 chars
  });
});
