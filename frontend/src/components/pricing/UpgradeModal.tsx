'use client';

import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  currentUsage: number;
  limit: number;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, currentUsage, limit }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Free Tier Limit Reached</h2>
        <p className="text-slate-600 mb-4">
          You've used {currentUsage} of {limit} receipts this month. Upgrade to Pro for unlimited receipts.
        </p>
        <div className="flex gap-3">
          <Button onClick={onUpgrade} className="flex-1">
            Upgrade to Pro ($19/mo)
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}
