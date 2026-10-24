import { useQuery } from '@tanstack/react-query'
import { sortByTimestamp } from '../helpers/sortByTimestamp'
import { messagesQuery } from './messagesQuery'

export const useMessages = (conversationId: number) =>
  useQuery({ ...messagesQuery(conversationId), select: sortByTimestamp })
