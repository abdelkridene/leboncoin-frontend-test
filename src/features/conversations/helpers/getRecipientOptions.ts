import type { Conversation, User } from '@/api/schemas'
import { getInterlocutor } from './getInterlocutor'

export interface RecipientOption {
  user: User
  existingConversationId: number | null
}

export const getRecipientOptions = (
  users: User[],
  conversations: Conversation[],
  loggedUserId: number,
): RecipientOption[] => {
  const conversationIdByInterlocutor = new Map(
    conversations.map((conversation) => [getInterlocutor(conversation, loggedUserId).id, conversation.id]),
  )
  return users
    .filter(({ id }) => id !== loggedUserId)
    .sort((a, b) => a.nickname.localeCompare(b.nickname, 'fr'))
    .map((user) => ({ user, existingConversationId: conversationIdByInterlocutor.get(user.id) ?? null }))
}
