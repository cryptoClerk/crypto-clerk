import { stripe } from "./stripe";

export type SubscriptionTier = "free" | "pro" | "business";

interface TierConfig {
  maxReceipts: number;
  maxWallets: number;
  features: string[];
}

export const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  free: {
    maxReceipts: 5,
    maxWallets: 3,
    features: ["Basic receipts", "PDF export", "Single wallet"],
  },
  pro: {
    maxReceipts: -1, // unlimited
    maxWallets: 10,
    features: ["Unlimited receipts", "Statements", "CSV export", "10 wallets"],
  },
  business: {
    maxReceipts: -1,
    maxWallets: -1, // unlimited
    features: ["Everything in Pro", "Team access", "API keys", "Priority support"],
  },
};

export function getUserTier(subscriptionStatus?: string | null): SubscriptionTier {
  if (!subscriptionStatus) return "free";
  if (subscriptionStatus === "active" || subscriptionStatus === "trialing") {
    // In real implementation, check the price ID to determine tier
    return "pro"; // Simplified
  }
  return "free";
}

export function canCreateReceipt(
  currentCount: number,
  tier: SubscriptionTier
): boolean {
  const config = TIER_CONFIG[tier];
  if (config.maxReceipts === -1) return true;
  return currentCount < config.maxReceipts;
}

export function canAddWallet(
  currentCount: number,
  tier: SubscriptionTier
): boolean {
  const config = TIER_CONFIG[tier];
  if (config.maxWallets === -1) return true;
  return currentCount < config.maxWallets;
}
