import type { IncomingMessage } from 'http'
import { prefetchForPage } from './serverPrefetch'

const requestWithHeaders = (headers: IncomingMessage['headers']) => ({ headers }) as IncomingMessage

describe('prefetchForPage', () => {
  afterEach(() => jest.useRealTimers())

  it('prefetches and dehydrates on full page loads', async () => {
    const { dehydratedState } = await prefetchForPage(requestWithHeaders({}), (queryClient) => [
      queryClient.prefetchQuery({ queryKey: ['greeting'], queryFn: () => 'bonjour' }),
    ])
    expect(dehydratedState?.queries[0].state.data).toBe('bonjour')
  })

  it('cancels the prefetches that miss the render budget', async () => {
    jest.useFakeTimers()
    let signal: AbortSignal | undefined
    const pending = prefetchForPage(requestWithHeaders({}), (queryClient) => [
      queryClient.prefetchQuery({
        queryKey: ['slow'],
        queryFn: ({ signal: querySignal }) => {
          signal = querySignal
          return new Promise(() => undefined)
        },
      }),
    ])

    await jest.advanceTimersByTimeAsync(1500)
    const { dehydratedState } = await pending

    expect(signal?.aborted).toBe(true)
    expect(dehydratedState?.queries).toHaveLength(0)
  })

  it('skips prefetching on client side navigations', async () => {
    const prefetch = jest.fn()
    const result = await prefetchForPage(requestWithHeaders({ 'x-nextjs-data': '1' }), prefetch)
    expect(result).toEqual({ dehydratedState: null, queryClient: null })
    expect(prefetch).not.toHaveBeenCalled()
  })
})
