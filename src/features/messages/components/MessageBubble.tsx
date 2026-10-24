import { cn } from '@/shared/helpers/cn'
import { formatMessageTime, toIsoString } from '@/shared/helpers/formatDate'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  body: string
  timestamp: number
  isMine: boolean
  authorName: string
}

export const MessageBubble = ({ body, timestamp, isMine, authorName }: MessageBubbleProps) => (
  <li className={cn(styles.message, isMine ? styles.mine : styles.theirs)}>
    <span className="visually-hidden">{isMine ? 'Vous' : authorName} :</span>
    <p className={styles.bubble}>{body}</p>
    {/* The server and the browser may not share a timezone; the browser's rendering wins. */}
    <time className={styles.time} dateTime={toIsoString(timestamp)} suppressHydrationWarning>
      {formatMessageTime(timestamp)}
    </time>
  </li>
)
