import Link from 'next/link'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { useFocusOnMount } from '@/shared/hooks/useFocusOnMount'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useRememberViewedConversation } from '@/features/conversations/hooks/useConversationFocusRestoration'
import { useConversation } from '@/features/conversations/hooks/useConversation'
import { getInterlocutor } from '@/features/conversations/helpers/getInterlocutor'
import { ConversationHeader } from './ConversationHeader'
import { ConversationThread } from './ConversationThread'
import { MessageListSkeleton } from './MessageListSkeleton'

interface ConversationPanelProps {
  conversationId: number
}

export const ConversationPanel = ({ conversationId }: ConversationPanelProps) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversation, isPending, isError, refetch } = useConversation(conversationId)
  const headingRef = useFocusOnMount<HTMLHeadingElement>(useIsMobile() && Boolean(conversation))
  useRememberViewedConversation(conversationId)

  if (isPending) return <MessageListSkeleton />
  if (isError) return <ErrorState description="Impossible de charger la conversation." onRetry={() => refetch()} />
  if (!conversation) {
    return (
      <EmptyState title="Conversation introuvable" description="Elle a peut-être été supprimée.">
        <Link href="/" className="text-link">
          Retour aux conversations
        </Link>
      </EmptyState>
    )
  }

  const interlocutorName = getInterlocutor(conversation, loggedUserId).nickname
  return (
    <>
      <ConversationHeader interlocutorName={interlocutorName} headingRef={headingRef} />
      <ConversationThread conversationId={conversationId} loggedUserId={loggedUserId} interlocutorName={interlocutorName} />
    </>
  )
}
