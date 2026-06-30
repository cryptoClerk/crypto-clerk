/**
 * Safe logger that only logs in development.
 * Optional: Add Sentry/LogRocket in production for error tracking.
 */
export function logError(error: unknown, context?: string) {
  if (process.env.NODE_ENV === "development") {
    if (context) {
      console.error(`[${context}]:`, error);
    } else {
      console.error(error);
    }
  }
  // Optional: Send to error tracking service in production
}

export function logWarn(message: string, context?: string) {
  if (process.env.NODE_ENV === "development") {
    if (context) {
      console.warn(`[${context}]:`, message);
    } else {
      console.warn(message);
    }
  }
}

export function logInfo(message: string, context?: string) {
  if (process.env.NODE_ENV === "development") {
    if (context) {
      console.log(`[${context}]:`, message);
    } else {
      console.log(message);
    }
  }
}
