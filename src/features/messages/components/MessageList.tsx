import type { Message } from '@/api/schemas'
import { useScrollToBottom } from '../hooks/useScrollToBottom'
import { MessageBubble } from './MessageBubble'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  loggedUserId: number
  interlocutorName: string
}

export const MessageList = ({ messages, loggedUserId, interlocutorName }: MessageListProps) => {
  const containerRef = useScrollToBottom<HTMLDivElement>(messages.length)

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-label={`Messages avec ${interlocutorName}`}
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
      </ul>
    </div>
  )
}
