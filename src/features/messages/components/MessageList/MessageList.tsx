import type { Message } from '@/api/schemas'
import type { OutgoingMessage } from '../../hooks/useSendMessage'
import { useScrollToBottom } from '../../hooks/useScrollToBottom'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  outgoingMessages: OutgoingMessage[]
  loggedUserId: number
  interlocutorName: string
  onRetry: (mutationId: number) => void
  isSending: boolean
}

export const MessageList = ({
  messages,
  outgoingMessages,
  loggedUserId,
  interlocutorName,
  onRetry,
  isSending,
}: MessageListProps) => {
  const containerRef = useScrollToBottom<HTMLDivElement>(messages.length + outgoingMessages.length)

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-label={`Messages avec ${interlocutorName}`}
      // Focusable so that keyboard users can scroll a long history in every browser, not only in Chrome.
      tabIndex={0}
      className={styles.container}
    >
      <ul className={styles.list}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            body={message.body}
            timestamp={message.timestamp}
            isMine={message.authorId === loggedUserId}
            authorName={interlocutorName}
          />
        ))}
        {outgoingMessages.map((message) => (
          <MessageBubble
            key={`outgoing-${message.mutationId}`}
            body={message.body}
            timestamp={message.timestamp}
            isMine
            authorName={interlocutorName}
            status={message.status}
            onRetry={() => onRetry(message.mutationId)}
            isRetryDisabled={isSending}
          />
        ))}
      </ul>
    </div>
  )
}
