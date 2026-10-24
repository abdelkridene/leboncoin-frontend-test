import { useConversations } from './useConversations'

export const useConversation = (conversationId: number) => {
  const { data: conversations, ...status } = useConversations()
  return {
    ...status,
    data: conversations && (conversations.find(({ id }) => id === conversationId) ?? null),
  }
}
