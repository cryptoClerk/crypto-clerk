'use client';

import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/stripe";

interface PricingCardProps {
  tier: "free" | "pro" | "business";
  currentTier?: string;
  onSubscribe?: (priceId: string) => void;
}

export default function PricingCard({ tier, currentTier, onSubscribe }: PricingCardProps) {
  const product = PRODUCTS[tier];
  const isCurrent = currentTier === tier;

  return (
    <div className={`rounded-lg border p-6 ${isCurrent ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-slate-600 mt-1">{product.description}</p>
      
      <div className="mt-4">
        <span className="text-3xl font-bold">${product.price}</span>
        {product.price > 0 && <span className="text-slate-600">/mo</span>}
      </div>

      {isCurrent ? (
        <Button disabled className="w-full mt-6">Current Plan</Button>
      ) : tier === "free" ? (
        <Button variant="outline" className="w-full mt-6">Get Started</Button>
      ) : (
        <Button 
          className="w-full mt-6"
          onClick={() => onSubscribe?.(tier)}
        >
          Subscribe
        </Button>
      )}
    </div>
  );
}
