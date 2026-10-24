import { z } from 'zod'
import { request } from './httpClient'
import { isNotFoundError } from './errors'
import { conversationSchema, createdResourceSchema, type Conversation } from './schemas'

export type NewConversation = Omit<Conversation, 'id'>

export const getConversations = async (userId: number, signal?: AbortSignal): Promise<Conversation[]> => {
  try {
    return await request(`/conversations/${userId}`, z.array(conversationSchema), { signal })
  } catch (error) {
    if (isNotFoundError(error)) return []
    throw error
  }
}

// The mock server stores the body as is, so the full conversation is sent rather than only recipientId.
export const createConversation = async (conversation: NewConversation): Promise<Conversation> => {
  const { id } = await request(`/conversations/${conversation.senderId}`, createdResourceSchema, {
    method: 'POST',
    body: conversation,
  })
  return { ...conversation, id }
}
