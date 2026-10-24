import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
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

  if (isPending) return <ConversationListSkeleton />
  if (isError) {
    return <ErrorState description="Impossible de charger vos conversations." onRetry={() => refetch()} />
  }
  if (conversations.length === 0) {
    return <EmptyState title="Aucune conversation" description="Vos échanges avec les vendeurs apparaîtront ici." />
  }
  return (
    <ConversationList
      conversations={conversations}
      loggedUserId={loggedUserId}
      selectedConversationId={selectedConversationId}
    />
  )
}

export const ConversationsSidebar = ({ selectedConversationId }: ConversationsSidebarProps) => (
  <>
    <h2 className={styles.title}>Mes conversations</h2>
    <SidebarContent selectedConversationId={selectedConversationId} />
  </>
)
