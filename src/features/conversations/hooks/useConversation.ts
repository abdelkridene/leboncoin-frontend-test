import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Conversation } from '@/api/schemas'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { conversationsQuery } from './conversationsQuery'

export const useConversation = (conversationId: number) => {
  const userId = useLoggedUserId()
  const findConversation = useCallback(
    (conversations: Conversation[]) => conversations.find(({ id }) => id === conversationId) ?? null,
    [conversationId],
  )
  return useQuery({ ...conversationsQuery(userId), select: findConversation })
}
