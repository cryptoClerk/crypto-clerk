import { calculateUsdValue } from "../../app/api/receipts/route";

describe("calculateUsdValue", () => {
  it("returns exact USD for stablecoins", () => {
    const usdc = calculateUsdValue(100.5, "USDC");
    expect(usdc.value).toBe("100.50");
    expect(usdc.isEstimated).toBe(false);

    const usdt = calculateUsdValue(50, "USDT");
    expect(usdt.value).toBe("50.00");
    expect(usdt.isEstimated).toBe(false);

    const dai = calculateUsdValue(1000, "DAI");
    expect(dai.value).toBe("1000.00");
    expect(dai.isEstimated).toBe(false);
  });

  it("returns raw amount for non-stablecoins", () => {
    const eth = calculateUsdValue(2.5, "ETH");
    expect(eth.value).toBe("2.500000");
    expect(eth.isEstimated).toBe(true);

    const btc = calculateUsdValue(0.5, "WBTC");
    expect(btc.isEstimated).toBe(true);
  });

  it("handles case-insensitive token symbols", () => {
    const lower = calculateUsdValue(100, "usdc");
    expect(lower.isEstimated).toBe(false);

    const upper = calculateUsdValue(100, "USDC");
    expect(upper.isEstimated).toBe(false);
  });
});
