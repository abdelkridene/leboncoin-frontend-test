import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useConversations } from './useConversations'

describe('useConversations', () => {
  it('loads the conversations of the logged user, most recent first', async () => {
    const { result } = renderHookWithProviders(() => useConversations())
    expect(result.current.isPending).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.map(({ id }) => id)).toEqual([3, 1, 2])
  })

  it('exposes errors', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 })))
    const { result } = renderHookWithProviders(() => useConversations())
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
