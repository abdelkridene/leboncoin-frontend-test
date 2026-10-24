export const queryKeys = {
  conversations: (userId: number) => ['conversations', userId] as const,
  messages: (conversationId: number) => ['messages', conversationId] as const,
  users: () => ['users'] as const,
  sendMessage: (conversationId: number) => ['sendMessage', conversationId] as const,
}
