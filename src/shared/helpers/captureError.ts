// Single entry point for monitoring: the browser reports the error as uncaught, where tools such as Sentry listen.
export const captureError = (error: unknown): void => {
  globalThis.reportError?.(error)
}
