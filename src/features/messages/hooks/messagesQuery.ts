import { queryOptions } from '@tanstack/react-query'
import { getMessages } from '@/api/messages'
import { queryKeys } from '@/api/queryKeys'

export const messagesQuery = (conversationId: number) =>
  queryOptions({
    queryKey: queryKeys.messages(conversationId),
    queryFn: ({ signal }) => getMessages(conversationId, signal),
  })
