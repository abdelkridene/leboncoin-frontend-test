import { z } from 'zod'
import { request } from './httpClient'
import { isNotFoundError } from './errors'
import { createdResourceSchema, messageSchema, type Message } from './schemas'

export type NewMessage = Omit<Message, 'id'>

export const getMessages = async (conversationId: number, signal?: AbortSignal): Promise<Message[]> => {
  try {
    return await request(`/messages/${conversationId}`, z.array(messageSchema), { signal })
  } catch (error) {
    if (isNotFoundError(error)) return []
    throw error
  }
}

// The mock server does not copy route params into the stored record, so they are sent in the body.
export const sendMessage = async (message: NewMessage): Promise<Message> => {
  const { id } = await request(`/messages/${message.conversationId}`, createdResourceSchema, {
    method: 'POST',
    body: message,
  })
  return { ...message, id }
}
