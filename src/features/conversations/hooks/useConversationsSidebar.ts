import { usePrefetchMessages } from '@/features/messages/hooks/usePrefetchMessages'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useRestoreConversationFocus } from './useConversationFocusRestoration'
import { useConversations } from './useConversations'

export const useConversationsSidebar = () => {
  const loggedUserId = useLoggedUserId()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const prefetchMessages = usePrefetchMessages()
  const isMobile = useIsMobile()
  const listRef = useRestoreConversationFocus<HTMLUListElement>(isMobile && conversations !== undefined)

  return {
    conversations,
    isPending,
    isStale: isError && conversations !== undefined,
    // On desktop the detail panel reports the failure, so the list stays empty rather than repeating it.
    reportsFailure: isMobile,
    reload: () => void refetch(),
    loggedUserId,
    prefetchMessages,
    listRef,
  }
}
