import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { StaleDataNotice } from '@/shared/components/StaleDataNotice'
import { useMessageComposer } from '../hooks/useMessageComposer'
import { useMessages } from '../hooks/useMessages'
import { useSendMessage } from '../hooks/useSendMessage'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import { MessageListSkeleton } from './MessageListSkeleton'

interface ConversationThreadProps {
  conversationId: number
  loggedUserId: number
  interlocutorName: string
}

export const ConversationThread = ({ conversationId, loggedUserId, interlocutorName }: ConversationThreadProps) => {
  const { data: messages, isPending, isError, refetch } = useMessages(conversationId)
  const { outgoingMessages, send, retry, isSending } = useSendMessage(conversationId)
  const composer = useMessageComposer({ onSend: send, isSending })

  const renderMessages = () => {
    if (isPending) return <MessageListSkeleton />
    if (!messages) return <ErrorState description="Impossible de charger les messages." onRetry={() => refetch()} />
    if (messages.length === 0 && outgoingMessages.length === 0) {
      return <EmptyState title="Aucun message" description={`Envoyez le premier message à ${interlocutorName}.`} />
    }
    return (
      <MessageList
        messages={messages}
        outgoingMessages={outgoingMessages}
        loggedUserId={loggedUserId}
        interlocutorName={interlocutorName}
        onRetry={retry}
        isSending={isSending}
      />
    )
  }

  return (
    <>
      {isError && messages && <StaleDataNotice onRetry={() => refetch()} />}
      {renderMessages()}
      <MessageComposer
        draft={composer.draft}
        onDraftChange={composer.setDraft}
        onSubmit={composer.handleSubmit}
        onKeyDown={composer.handleKeyDown}
        textareaRef={composer.textareaRef}
        canSubmit={composer.canSubmit}
        remainingCharacters={composer.remainingCharacters}
        isNearLimit={composer.isNearLimit}
        recipientName={interlocutorName}
      />
    </>
  )
}
