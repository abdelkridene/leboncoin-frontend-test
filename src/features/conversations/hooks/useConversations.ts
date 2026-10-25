import { skipToken, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { Conversation } from '@/api/schemas'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { mergeConversations } from '../helpers/mergeConversations'
import { sortByLastMessage } from '../helpers/sortByLastMessage'
import { conversationsQuery } from './conversationsQuery'

const NO_CONVERSATIONS: Conversation[] = []

// The mock API never lists conversations created after it started, so they are kept client side until it does.
const useCreatedConversations = (userId: number) =>
  useQuery<Conversation[]>({ queryKey: queryKeys.createdConversations(userId), queryFn: skipToken }).data ??
  NO_CONVERSATIONS

export const useConversations = () => {
  const userId = useLoggedUserId()
  const { data, isPending, isError, refetch } = useQuery(conversationsQuery(userId))
  const createdConversations = useCreatedConversations(userId)

  return {
    data: data && sortByLastMessage(mergeConversations(data, createdConversations)),
    isPending,
    isError,
    refetch,
  }
}
