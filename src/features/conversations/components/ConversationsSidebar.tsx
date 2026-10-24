import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { StaleDataNotice } from '@/shared/components/StaleDataNotice'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useRestoreConversationFocus } from '../hooks/useConversationFocusRestoration'
import { useConversations } from '../hooks/useConversations'
import { ConversationList } from './ConversationList'
import { ConversationListSkeleton } from './ConversationListSkeleton'
import styles from './ConversationsSidebar.module.css'

interface ConversationsSidebarProps {
  selectedConversationId: number | null
}

const SidebarContent = ({ selectedConversationId }: ConversationsSidebarProps) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const listRef = useRestoreConversationFocus<HTMLUListElement>(useIsMobile() && conversations !== undefined)

  if (isPending) return <ConversationListSkeleton />
  if (!conversations) {
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
        />
      )}
    </>
  )
}

export const ConversationsSidebar = ({ selectedConversationId }: ConversationsSidebarProps) => (
  <>
    <h2 className={styles.title}>Mes conversations</h2>
    <SidebarContent selectedConversationId={selectedConversationId} />
  </>
)
