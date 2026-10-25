import { CutCableIllustration } from '@/shared/components/CutCableIllustration/CutCableIllustration'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { StaleDataNotice } from '@/shared/components/StaleDataNotice/StaleDataNotice'
import { useConversationThread } from '../../hooks/useConversationThread'
import { MessageComposer } from '../MessageComposer/MessageComposer'
import { MessageList } from '../MessageList/MessageList'
import { MessageListSkeleton } from '../MessageListSkeleton/MessageListSkeleton'
import styles from './ConversationThread.module.css'

interface ConversationThreadProps {
  conversationId: number
  loggedUserId: number
  interlocutorName: string
}

export const ConversationThread = ({ conversationId, loggedUserId, interlocutorName }: ConversationThreadProps) => {
  const { messages, isPending, isError, reload, outgoingMessages, isSending, retry, composer } =
    useConversationThread(conversationId)

  const renderMessages = () => {
    if (isPending) return <MessageListSkeleton />
    if (!messages) {
      return (
        <ErrorState
          illustration={<CutCableIllustration />}
          description="Impossible de charger les messages."
          onRetry={reload}
        />
      )
    }
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
      {isError && messages && <StaleDataNotice onRetry={reload} />}
      <div className={styles.thread}>{renderMessages()}</div>
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
