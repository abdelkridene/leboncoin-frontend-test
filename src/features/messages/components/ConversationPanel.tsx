import Link from 'next/link'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { useConversation } from '@/features/conversations/hooks/useConversation'
import { getInterlocutor } from '@/features/conversations/helpers/getInterlocutor'
import { useMessages } from '../hooks/useMessages'
import { ConversationHeader } from './ConversationHeader'
import { MessageList } from './MessageList'
import { MessageListSkeleton } from './MessageListSkeleton'

interface ConversationPanelProps {
  conversationId: number
}

interface MessagesProps extends ConversationPanelProps {
  loggedUserId: number
  interlocutorName: string
}

const Messages = ({ conversationId, loggedUserId, interlocutorName }: MessagesProps) => {
  const { data: messages, isPending, isError, refetch } = useMessages(conversationId)

  if (isPending) return <MessageListSkeleton />
  if (isError) return <ErrorState description="Impossible de charger les messages." onRetry={() => refetch()} />
  if (messages.length === 0) {
    return <EmptyState title="Aucun message" description={`Envoyez le premier message à ${interlocutorName}.`} />
  }
  return <MessageList messages={messages} loggedUserId={loggedUserId} interlocutorName={interlocutorName} />
}

export const ConversationPanel = ({ conversationId }: ConversationPanelProps) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversation, isPending, isError, refetch } = useConversation(conversationId)

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
      <ConversationHeader interlocutorName={interlocutorName} />
      <Messages conversationId={conversationId} loggedUserId={loggedUserId} interlocutorName={interlocutorName} />
    </>
  )
}
