'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, "Global error boundary");
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-600 max-w-md text-center">
            We encountered an unexpected error. Please try again.
          </p>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
