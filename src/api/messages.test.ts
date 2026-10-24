import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { messages } from '@/test/fixtures'
import { getMessages, sendMessage } from './messages'
import { HttpError, InvalidResponseError } from './errors'

describe('getMessages', () => {
  it('returns the messages of the conversation', async () => {
    await expect(getMessages(1)).resolves.toEqual(messages)
  })

  it('accepts numeric string timestamps as documented in the swagger', async () => {
    server.use(
      http.get(apiUrl('/messages/:conversationId'), () =>
        HttpResponse.json([{ ...messages[0], timestamp: '1625637849' }]),
      ),
    )
    await expect(getMessages(1)).resolves.toEqual([{ ...messages[0], timestamp: 1625637849 }])
  })

  it('rejects malformed messages', async () => {
    server.use(
      http.get(apiUrl('/messages/:conversationId'), () => HttpResponse.json([{ ...messages[0], body: null }])),
    )
    await expect(getMessages(1)).rejects.toBeInstanceOf(InvalidResponseError)
  })

  it('returns an empty list on 404', async () => {
    server.use(http.get(apiUrl('/messages/:conversationId'), () => new HttpResponse(null, { status: 404 })))
    await expect(getMessages(1)).resolves.toEqual([])
  })

  it('rethrows other errors', async () => {
    server.use(http.get(apiUrl('/messages/:conversationId'), () => new HttpResponse(null, { status: 500 })))
    await expect(getMessages(1)).rejects.toEqual(new HttpError(500))
  })
})

describe('sendMessage', () => {
  it('posts the message with its conversation and author and returns it with its id', async () => {
    let body: unknown
    server.use(
      http.post(apiUrl('/messages/1'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 7 })
      }),
    )
    const newMessage = { conversationId: 1, authorId: 1, timestamp: 1700000000, body: 'Salut' }

    await expect(sendMessage(newMessage)).resolves.toEqual({ ...newMessage, id: 7 })
    expect(body).toEqual(newMessage)
  })
})
