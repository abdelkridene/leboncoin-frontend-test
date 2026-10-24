import { queryOptions } from '@tanstack/react-query'
import { getConversations } from '@/api/conversations'
import { queryKeys } from '@/api/queryKeys'

export const conversationsQuery = (userId: number) =>
  queryOptions({
    queryKey: queryKeys.conversations(userId),
    queryFn: ({ signal }) => getConversations(userId, signal),
  })
