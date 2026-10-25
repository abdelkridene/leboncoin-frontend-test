import type { IncomingMessage } from 'http'
import { dehydrate, type DehydratedState, type QueryClient } from '@tanstack/react-query'
import { createServerQueryClient, prefetchWithinBudget } from './queryClient'

export interface PrefetchedProps {
  dehydratedState: DehydratedState | null
}

interface PrefetchResult extends PrefetchedProps {
  queryClient: QueryClient | null
}

// Client-side navigations already have a warm cache: prefetching again would only double the API load.
const isClientSideNavigation = (request: IncomingMessage) => Boolean(request.headers['x-nextjs-data'])

export const prefetchForPage = async (
  request: IncomingMessage,
  prefetch: (queryClient: QueryClient) => Promise<unknown>[],
): Promise<PrefetchResult> => {
  if (isClientSideNavigation(request)) return { dehydratedState: null, queryClient: null }

  const queryClient = createServerQueryClient()
  await prefetchWithinBudget(prefetch(queryClient))
  return { dehydratedState: dehydrate(queryClient), queryClient }
}
