import type { Conversation } from '@/api/schemas'

export const sortByLastMessage = (conversations: Conversation[]): Conversation[] =>
  [...conversations].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp)
