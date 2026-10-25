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
  afterEach(() => jest.useRealTimers())

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

  it('also bumps the conversations created locally', async () => {
    const { result, queryClient } = setup()
    const created = { ...conversations[0], id: 1, lastMessageTimestamp: 0 }
    queryClient.setQueryData(queryKeys.createdConversations(1), [created])

    act(() => result.current.send('Salut'))
    await waitFor(() => expect(result.current.outgoingMessages).toHaveLength(0))
    const [updated] = queryClient.getQueryData<typeof conversations>(queryKeys.createdConversations(1)) ?? []
    expect(updated.lastMessageTimestamp).toBeGreaterThan(0)
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

  it('keeps failed messages long after the cache would normally forget them', async () => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'] })
    server.use(http.post(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 })))
    const { result } = setup()

    act(() => result.current.send('Premier'))
    await waitFor(() => expect(result.current.outgoingMessages[0]?.status).toBe('failed'))
    act(() => result.current.send('Second'))
    await waitFor(() => expect(result.current.outgoingMessages[1]?.status).toBe('failed'))

    await act(() => jest.advanceTimersByTimeAsync(60 * 60_000))
    expect(result.current.outgoingMessages.map(({ body }) => body)).toEqual(['Premier', 'Second'])
  })

  it('forgets delivered messages so the mutation cache does not grow', async () => {
    const { result, queryClient } = setup()
    act(() => result.current.send('Salut'))
    await waitFor(() => expect(queryClient.getMutationCache().getAll()).toHaveLength(0))
  })

  it('stamps a retried message with the time it is sent again', async () => {
    jest.useFakeTimers({ now: new Date('2021-07-07T10:00:00Z'), doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate'] })
    const postedTimestamps: number[] = []
    server.use(
      http.post(apiUrl('/messages/1'), async ({ request }) => {
        postedTimestamps.push(((await request.json()) as { timestamp: number }).timestamp)
        return postedTimestamps.length === 1 ? new HttpResponse(null, { status: 503 }) : HttpResponse.json({ id: 60 })
      }),
    )
    const { result } = setup()

    act(() => result.current.send('Salut'))
    await waitFor(() => expect(result.current.outgoingMessages[0]?.status).toBe('failed'))
    await act(() => jest.advanceTimersByTimeAsync(90_000))
    act(() => result.current.retry(result.current.outgoingMessages[0].mutationId))

    await waitFor(() => expect(postedTimestamps).toHaveLength(2))
    expect(postedTimestamps[1] - postedTimestamps[0]).toBe(90)
  })

  it('ignores retries of unknown messages', () => {
    const { result } = setup()
    expect(() => act(() => result.current.retry(12345))).not.toThrow()
    expect(result.current.outgoingMessages).toHaveLength(0)
  })

  it('never invents a history that was not loaded', async () => {
    const { result, queryClient } = renderHookWithProviders(() => useSendMessage(3))
    act(() => result.current.send('Premier message'))
    await waitFor(() => expect(result.current.outgoingMessages).toHaveLength(0))
    expect(queryClient.getQueryData(queryKeys.messages(3))).toBeUndefined()
    expect(queryClient.getQueryData(queryKeys.conversations(1))).toBeUndefined()
  })

  it('invalidates the conversation once delivered, so the server copy wins', async () => {
    const { result, queryClient } = setup()
    act(() => result.current.send('Salut'))
    await waitFor(() => expect(queryClient.getQueryState(queryKeys.messages(1))?.isInvalidated).toBe(true))
  })
})
