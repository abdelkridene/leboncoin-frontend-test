import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useConversationPanel } from './useConversationPanel'

describe('useConversationPanel', () => {
  it('is loading, then ready with the name of the other person', async () => {
    const { result } = renderHookWithProviders(() => useConversationPanel(3))
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current).toMatchObject({ status: 'ready', interlocutorName: 'Elodie' }))
  })

  it('reports a conversation the user does not have', async () => {
    const { result } = renderHookWithProviders(() => useConversationPanel(999))
    await waitFor(() => expect(result.current.status).toBe('missing'))
  })

  it('reports a failure and reloads on demand', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    const { result } = renderHookWithProviders(() => useConversationPanel(1))
    await waitFor(() => expect(result.current.status).toBe('error'))

    result.current.reload()
    await waitFor(() => expect(result.current.status).toBe('ready'))
  })
})
