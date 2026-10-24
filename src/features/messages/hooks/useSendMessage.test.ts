import { act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { conversations, messages } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { queryKeys } from '@/api/queryKeys'
import { useSendMessage } from './useSendMessage'

const setup = () => {
  const hook = renderHookWithProviders(() => useSendMessage(1))
  hook.queryClient.setQueryData(queryKeys.messages(1), messages)
  hook.queryClient.setQueryData(queryKeys.conversations(1), conversations)
  return hook
}

describe('useSendMessage', () => {
  it('shows the message as pending, then appends it to the conversation', async () => {
    let release: () => void = () => undefined
    server.use(
      http.post(apiUrl('/messages/1'), async () => {
        await new Promise<void>((resolve) => (release = resolve))
        return HttpResponse.json({ id: 50 })
      }),
    )
    const { result, queryClient } = setup()

    act(() => result.current.send('Salut'))
    await waitFor(() => expect(result.current.outgoingMessages).toHaveLength(1))
    expect(result.current.outgoingMessages[0]).toMatchObject({ body: 'Salut', authorId: 1, status: 'pending' })
    expect(result.current.isSending).toBe(true)

    act(() => release())
    await waitFor(() => expect(result.current.outgoingMessages).toHaveLength(0))
    const cachedMessages = queryClient.getQueryData<typeof messages>(queryKeys.messages(1))
    expect(cachedMessages?.at(-1)).toMatchObject({ id: 50, body: 'Salut' })
    const updatedConversation = queryClient.getQueryData<typeof conversations>(queryKeys.conversations(1))?.[0]
    expect(updatedConversation?.lastMessageTimestamp).toBe(cachedMessages?.at(-1)?.timestamp)
  })

  it('keeps a failed message and sends it again on retry', async () => {
    server.use(http.post(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    const { result, queryClient } = setup()

    act(() => result.current.send('Salut'))
    await waitFor(() => expect(result.current.outgoingMessages[0]?.status).toBe('failed'))
    expect(result.current.isSending).toBe(false)

    act(() => result.current.retry(result.current.outgoingMessages[0].mutationId))
    await waitFor(() => expect(result.current.outgoingMessages).toHaveLength(0))
    expect(queryClient.getQueryData<typeof messages>(queryKeys.messages(1))?.at(-1)?.body).toBe('Salut')
  })

  it('ignores retries of unknown messages', () => {
    const { result } = setup()
    expect(() => act(() => result.current.retry(12345))).not.toThrow()
    expect(result.current.outgoingMessages).toHaveLength(0)
  })

  it('creates the messages cache when it was empty and ignores a missing conversations cache', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useSendMessage(3))
    act(() => result.current.send('Premier message'))
    await waitFor(() => expect(queryClient.getQueryData(queryKeys.messages(3))).toHaveLength(1))
    expect(queryClient.getQueryData(queryKeys.conversations(1))).toBeUndefined()
  })
})
