import { QueryClient } from '@tanstack/react-query'
import { InvalidResponseError, isClientError } from './errors'

const STALE_TIME_MS = 30_000
const MAX_RETRIES = 3
const BASE_RETRY_DELAY_MS = 1_000
const MAX_RETRY_DELAY_MS = 8_000
const SERVER_PREFETCH_BUDGET_MS = 1_500

export const shouldRetry = (failureCount: number, error: unknown): boolean =>
  failureCount < MAX_RETRIES && !isClientError(error) && !(error instanceof InvalidResponseError)

export const getRetryDelay = (attemptIndex: number): number =>
  Math.min(BASE_RETRY_DELAY_MS * 2 ** attemptIndex, MAX_RETRY_DELAY_MS)

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: STALE_TIME_MS, retry: shouldRetry, retryDelay: getRetryDelay },
      mutations: { retry: false },
    },
  })

export const createServerQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { staleTime: STALE_TIME_MS, retry: false } } })

// A slow API must not block server rendering: whatever is not ready in time is fetched by the browser.
export const prefetchWithinBudget = async (
  prefetches: Promise<unknown>[],
  budgetMs: number = SERVER_PREFETCH_BUDGET_MS,
): Promise<void> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const budget = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, budgetMs)
  })
  await Promise.race([Promise.allSettled(prefetches), budget])
  clearTimeout(timer)
}
