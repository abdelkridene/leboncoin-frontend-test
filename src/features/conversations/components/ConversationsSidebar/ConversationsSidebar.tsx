import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { StaleDataNotice } from '@/shared/components/StaleDataNotice/StaleDataNotice'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useRestoreConversationFocus } from '../../hooks/useConversationFocusRestoration'
import { usePrefetchMessages } from '@/features/messages/hooks/usePrefetchMessages'
import { useConversations } from '../../hooks/useConversations'
import { ConversationList } from '../ConversationList/ConversationList'
import { ConversationListSkeleton } from '../ConversationListSkeleton/ConversationListSkeleton'
import { NewConversationButton } from '../NewConversationButton/NewConversationButton'
import styles from './ConversationsSidebar.module.css'

interface ConversationsSidebarProps {
  selectedConversationId: number | null
}

const SidebarContent = ({ selectedConversationId }: ConversationsSidebarProps) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const prefetchMessages = usePrefetchMessages()
  const isMobile = useIsMobile()
  const listRef = useRestoreConversationFocus<HTMLUListElement>(isMobile && conversations !== undefined)

  if (isPending) return <ConversationListSkeleton />
  if (!conversations) {
    // On desktop the detail panel reports the failure, so the list stays empty rather than repeating it.
    if (!isMobile) return null
    return <ErrorState description="Impossible de charger vos conversations." onRetry={() => refetch()} />
  }
  return (
    <>
      {isError && <StaleDataNotice onRetry={() => refetch()} />}
      {conversations.length === 0 ? (
        <EmptyState title="Aucune conversation" description="Vos échanges avec les vendeurs apparaîtront ici." />
      ) : (
        <ConversationList
          conversations={conversations}
          loggedUserId={loggedUserId}
          selectedConversationId={selectedConversationId}
          listRef={listRef}
          onPrefetchConversation={prefetchMessages}
        />
      )}
    </>
  )
}

export const ConversationsSidebar = ({ selectedConversationId }: ConversationsSidebarProps) => (
  <>
    <div className={styles.header}>
      <h2 className={styles.title}>Mes conversations</h2>
      <NewConversationButton />
    </div>
    <SidebarContent selectedConversationId={selectedConversationId} />
  </>
)
