import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" as any })
  : null;

// Price IDs for your products (set these in env vars or hardcode after creating in Stripe Dashboard)
export const PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_PRO || "price_pro_placeholder",
  business: process.env.STRIPE_PRICE_BUSINESS || "price_business_placeholder",
};

// Product names
export const PRODUCTS = {
  free: {
    name: "Free",
    description: "5 receipts/month",
    price: 0,
  },
  pro: {
    name: "Pro",
    description: "Unlimited receipts + statements",
    price: 19,
  },
  business: {
    name: "Business",
    description: "Team collaboration + API access",
    price: 49,
  },
};
