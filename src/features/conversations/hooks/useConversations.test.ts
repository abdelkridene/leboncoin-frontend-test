import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { createTestQueryClient, renderHookWithProviders } from '@/test/renderWithProviders'
import { conversations } from '@/test/fixtures'
import { queryKeys } from '@/api/queryKeys'
import { useConversations } from './useConversations'

describe('useConversations', () => {
  it('loads the conversations of the logged user, most recent first', async () => {
    const { result } = renderHookWithProviders(() => useConversations())
    expect(result.current.isPending).toBe(true)

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.data?.map(({ id }) => id)).toEqual([3, 1, 2])
  })

  it('exposes errors', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 })))
    const { result } = renderHookWithProviders(() => useConversations())
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('includes the conversations created locally that the API does not list yet', async () => {
    const created = { ...conversations[0], id: 10, lastMessageTimestamp: 1700000000 }
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(queryKeys.createdConversations(1), [created])

    const { result } = renderHookWithProviders(() => useConversations(), queryClient)
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.data?.map(({ id }) => id)).toEqual([10, 3, 1, 2])
  })
})
