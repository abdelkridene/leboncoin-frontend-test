import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { StaleDataNotice } from '@/shared/components/StaleDataNotice/StaleDataNotice'
import { useConversationsSidebar } from '../../hooks/useConversationsSidebar'
import { ConversationList } from '../ConversationList/ConversationList'
import { ConversationListSkeleton } from '../ConversationListSkeleton/ConversationListSkeleton'
import { NewConversationButton } from '../NewConversationButton/NewConversationButton'
import styles from './ConversationsSidebar.module.css'

interface ConversationsSidebarProps {
  selectedConversationId: number | null
}

const SidebarContent = ({ selectedConversationId }: ConversationsSidebarProps) => {
  const sidebar = useConversationsSidebar()

  if (sidebar.isPending) return <ConversationListSkeleton />
  if (!sidebar.conversations) {
    if (!sidebar.reportsFailure) return null
    return <ErrorState description="Impossible de charger vos conversations." onRetry={sidebar.reload} />
  }
  return (
    <>
      {sidebar.isStale && <StaleDataNotice onRetry={sidebar.reload} />}
      {sidebar.conversations.length === 0 ? (
        <EmptyState title="Aucune conversation" description="Vos échanges avec les vendeurs apparaîtront ici." />
      ) : (
        <ConversationList
          conversations={sidebar.conversations}
          loggedUserId={sidebar.loggedUserId}
          selectedConversationId={selectedConversationId}
          listRef={sidebar.listRef}
          onPrefetchConversation={sidebar.prefetchMessages}
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
