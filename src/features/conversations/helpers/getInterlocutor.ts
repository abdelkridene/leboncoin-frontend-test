import type { Conversation } from '@/api/schemas'

export interface Interlocutor {
  id: number
  nickname: string
}

export const getInterlocutor = (conversation: Conversation, loggedUserId: number): Interlocutor =>
  conversation.senderId === loggedUserId
    ? { id: conversation.recipientId, nickname: conversation.recipientNickname }
    : { id: conversation.senderId, nickname: conversation.senderNickname }
