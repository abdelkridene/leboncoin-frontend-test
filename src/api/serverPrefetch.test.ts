import type { IncomingMessage } from 'http'
import { prefetchForPage } from './serverPrefetch'

const requestWithHeaders = (headers: IncomingMessage['headers']) => ({ headers }) as IncomingMessage

describe('prefetchForPage', () => {
  it('prefetches and dehydrates on full page loads', async () => {
    const { dehydratedState } = await prefetchForPage(requestWithHeaders({}), (queryClient) => [
      queryClient.prefetchQuery({ queryKey: ['greeting'], queryFn: () => 'bonjour' }),
    ])
    expect(dehydratedState?.queries[0].state.data).toBe('bonjour')
  })

  it('skips prefetching on client side navigations', async () => {
    const prefetch = jest.fn()
    const result = await prefetchForPage(requestWithHeaders({ 'x-nextjs-data': '1' }), prefetch)
    expect(result).toEqual({ dehydratedState: null, queryClient: null })
    expect(prefetch).not.toHaveBeenCalled()
  })
})
