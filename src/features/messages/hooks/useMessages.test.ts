import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { messages } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useMessages } from './useMessages'

describe('useMessages', () => {
  it('loads the messages of the conversation in chronological order', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => HttpResponse.json([...messages].reverse())))
    const { result } = renderHookWithProviders(() => useMessages(1))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(messages)
  })

  it('cancels the pending request of the previous conversation', async () => {
    server.use(http.get(apiUrl('/messages/1'), () => new Promise<Response>(() => undefined)))
    let currentId = 1
    const { rerender, result, queryClient } = renderHookWithProviders(() => useMessages(currentId))
    await waitFor(() => expect(queryClient.getQueryState(['messages', 1])?.fetchStatus).toBe('fetching'))

    currentId = 2
    rerender()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(queryClient.getQueryState(['messages', 1])?.fetchStatus).toBe('idle')
  })
})
