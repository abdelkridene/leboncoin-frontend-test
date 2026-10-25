import { CutCableIllustration } from '@/shared/components/CutCableIllustration/CutCableIllustration'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { useConversations } from '../../hooks/useConversations'

export const NoConversationSelected = () => {
  const { data: conversations, isPending, refetch } = useConversations()

  if (!isPending && !conversations) {
    return (
      <ErrorState
        illustration={<CutCableIllustration />}
        description="Impossible de charger vos conversations."
        onRetry={() => refetch()}
      />
    )
  }
  return <EmptyState title="Sélectionnez une conversation" description="Vos échanges s’afficheront ici." />
}
