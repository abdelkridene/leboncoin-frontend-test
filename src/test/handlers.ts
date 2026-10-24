import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/api/config'
import { conversations, messages, users } from './fixtures'

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`

let nextId = 100

export const handlers = [
  http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json(conversations)),
  http.post(apiUrl('/conversations/:userId'), () => HttpResponse.json({ id: nextId++ })),
  http.get(apiUrl('/messages/:conversationId'), ({ params }) =>
    HttpResponse.json(messages.filter(({ conversationId }) => conversationId === Number(params.conversationId))),
  ),
  http.post(apiUrl('/messages/:conversationId'), () => HttpResponse.json({ id: nextId++ })),
  http.get(apiUrl('/users'), () => HttpResponse.json(users)),
]
