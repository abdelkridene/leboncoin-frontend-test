import { usePrefetchMessages } from '@/features/messages/hooks/usePrefetchMessages'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useRestoreConversationFocus } from './useConversationFocusRestoration'
import { useConversations } from './useConversations'

export const useConversationsSidebar = (selectedConversationId: number | null) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const prefetchMessages = usePrefetchMessages()
  const isMobile = useIsMobile()
  // On mobile the list hides behind an open conversation: it takes the focus back once it is on screen again.
  const listRef = useRestoreConversationFocus<HTMLUListElement>(
    isMobile && selectedConversationId === null && conversations !== undefined,
  )

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
