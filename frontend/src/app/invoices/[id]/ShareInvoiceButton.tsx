"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, CheckCircle } from "lucide-react";

interface ShareInvoiceButtonProps {
  invoiceId: string;
}

export default function ShareInvoiceButton({ invoiceId }: ShareInvoiceButtonProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/pay/${invoiceId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </>
        )}
      </Button>
      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          View Public Page
        </Button>
      </a>
    </div>
  );
}
