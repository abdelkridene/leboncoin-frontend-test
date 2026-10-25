import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { conversations } from '@/test/fixtures'
import { queryKeys } from '@/api/queryKeys'
import { mockMobileViewport } from '@/test/mockViewport'
import { createTestQueryClient, renderHookWithProviders } from '@/test/renderWithProviders'
import { useConversationsSidebar } from './useConversationsSidebar'

const failOnce = () =>
  server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }))

describe('useConversationsSidebar', () => {
  it('loads the conversations of the logged user', async () => {
    const { result } = renderHookWithProviders(() => useConversationsSidebar())
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.conversations).toHaveLength(3))
    expect(result.current.loggedUserId).toBe(1)
  })

  it('reports failures itself on mobile only, where the list is the whole screen', () => {
    expect(renderHookWithProviders(() => useConversationsSidebar()).result.current.reportsFailure).toBe(false)

    const restore = mockMobileViewport()
    expect(renderHookWithProviders(() => useConversationsSidebar()).result.current.reportsFailure).toBe(true)
    restore()
  })

  it('flags cached conversations as stale when a refresh fails', async () => {
    failOnce()
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(queryKeys.conversations(1), conversations)
    const { result } = renderHookWithProviders(() => useConversationsSidebar(), queryClient)

    await waitFor(() => expect(result.current.isStale).toBe(true))
    result.current.reload()
    await waitFor(() => expect(result.current.isStale).toBe(false))
  })
})
