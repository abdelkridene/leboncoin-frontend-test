import { act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useRouter } from 'next/router'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { users } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { queryKeys } from '@/api/queryKeys'
import { useCreateConversation } from './useCreateConversation'

const [me, , , elodie] = users

describe('useCreateConversation', () => {
  it('creates the conversation, keeps it in cache and opens it', async () => {
    let body: unknown
    server.use(
      http.post(apiUrl('/conversations/1'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 42 })
      }),
    )
    const onCreated = jest.fn()
    const { result, queryClient } = renderHookWithProviders(() => useCreateConversation())

    act(() => result.current.create({ sender: me, recipient: elodie }, onCreated))

    await waitFor(() => expect(onCreated).toHaveBeenCalled())
    expect(body).toMatchObject({ senderId: 1, senderNickname: 'Thibaut', recipientId: 4, recipientNickname: 'Elodie' })
    expect(queryClient.getQueryData(queryKeys.createdConversations(1))).toEqual([expect.objectContaining({ id: 42 })])
    expect(useRouter().push).toHaveBeenCalledWith('/conversations/42')
  })

  it('reports failures without navigating', async () => {
    server.use(http.post(apiUrl('/conversations/1'), () => new HttpResponse(null, { status: 503 })))
    const onCreated = jest.fn()
    const { result } = renderHookWithProviders(() => useCreateConversation())

    act(() => result.current.create({ sender: me, recipient: elodie }, onCreated))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(onCreated).not.toHaveBeenCalled()
    expect(useRouter().push).not.toHaveBeenCalled()

    act(() => result.current.reset())
    await waitFor(() => expect(result.current.isError).toBe(false))
  })
})
