import type { Conversation } from '@/api/schemas'

export const mergeConversations = (fromServer: Conversation[], createdLocally: Conversation[]): Conversation[] => {
  const knownIds = new Set(fromServer.map(({ id }) => id))
  return [...fromServer, ...createdLocally.filter(({ id }) => !knownIds.has(id))]
}
