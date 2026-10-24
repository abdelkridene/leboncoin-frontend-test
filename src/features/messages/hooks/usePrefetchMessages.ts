import { useQueryClient } from '@tanstack/react-query'
import { messagesQuery } from './messagesQuery'

export const usePrefetchMessages = () => {
  const queryClient = useQueryClient()
  return (conversationId: number) => {
    void queryClient.prefetchQuery(messagesQuery(conversationId))
  }
}
