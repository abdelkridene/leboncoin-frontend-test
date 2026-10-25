import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/api/config'
import type { Conversation, Message } from '@/api/schemas'
import { conversations, messages, users } from './fixtures'

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`

const FIRST_CREATED_ID = 100

// Like the real API, what is posted is returned by the next GET, so refetches after a mutation stay realistic.
const database = { conversations: [...conversations], messages: [...messages], nextId: FIRST_CREATED_ID }

export const resetDatabase = () => {
  database.conversations = [...conversations]
  database.messages = [...messages]
  database.nextId = FIRST_CREATED_ID
}

export const handlers = [
  http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json(database.conversations)),
  http.post(apiUrl('/conversations/:userId'), async ({ request }) => {
    const conversation = { ...((await request.json()) as Omit<Conversation, 'id'>), id: database.nextId++ }
    database.conversations.push(conversation)
    return HttpResponse.json({ id: conversation.id })
  }),
  http.get(apiUrl('/messages/:conversationId'), ({ params }) =>
    HttpResponse.json(database.messages.filter(({ conversationId }) => conversationId === Number(params.conversationId))),
  ),
  http.post(apiUrl('/messages/:conversationId'), async ({ request }) => {
    const message = { ...((await request.json()) as Omit<Message, 'id'>), id: database.nextId++ }
    database.messages.push(message)
    return HttpResponse.json({ id: message.id })
  }),
  http.get(apiUrl('/users'), () => HttpResponse.json(users)),
]
