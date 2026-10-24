import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { conversations } from '@/test/fixtures'
import { createConversation, getConversations } from './conversations'
import { HttpError } from './errors'

describe('getConversations', () => {
  it('returns the conversations of the user', async () => {
    await expect(getConversations(1)).resolves.toEqual(conversations)
  })

  it('returns an empty list on 404', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 404 })))
    await expect(getConversations(1)).resolves.toEqual([])
  })

  it('rethrows other errors', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 })))
    await expect(getConversations(1)).rejects.toEqual(new HttpError(503))
  })
})

describe('createConversation', () => {
  it('posts the full conversation and returns it with its new id', async () => {
    let body: unknown
    server.use(
      http.post(apiUrl('/conversations/1'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 42 })
      }),
    )
    const { senderId, senderNickname, recipientId, recipientNickname, lastMessageTimestamp } = conversations[0]
    const newConversation = { senderId, senderNickname, recipientId, recipientNickname, lastMessageTimestamp }

    await expect(createConversation(newConversation)).resolves.toEqual({ ...newConversation, id: 42 })
    expect(body).toEqual(newConversation)
  })
})
