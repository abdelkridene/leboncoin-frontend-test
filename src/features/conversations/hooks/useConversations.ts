import { useQuery } from '@tanstack/react-query'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { sortByLastMessage } from '../helpers/sortByLastMessage'
import { conversationsQuery } from './conversationsQuery'

export const useConversations = () => {
  const userId = useLoggedUserId()
  return useQuery({ ...conversationsQuery(userId), select: sortByLastMessage })
}
