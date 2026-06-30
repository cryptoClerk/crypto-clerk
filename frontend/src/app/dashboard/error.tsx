'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/logger';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "Dashboard error boundary");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
      <p className="text-slate-600 max-w-md text-center">
        We encountered an error loading this page. Please try again.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
