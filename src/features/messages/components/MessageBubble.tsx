import { cn } from '@/shared/helpers/cn'
import { formatMessageTime, toIsoString } from '@/shared/helpers/formatDate'
import type { OutgoingStatus } from '../hooks/useSendMessage'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  body: string
  timestamp: number
  isMine: boolean
  authorName: string
  status?: OutgoingStatus
  onRetry?: () => void
  isRetryDisabled?: boolean
}

const DeliveryStatus = ({ status, onRetry, isRetryDisabled }: Pick<MessageBubbleProps, 'status' | 'onRetry' | 'isRetryDisabled'>) => {
  if (status === 'pending') return <span className={styles.status}>Envoi…</span>
  return (
    <span className={cn(styles.status, styles.failed)}>
      Échec de l’envoi.
      <button type="button" className={styles.retry} onClick={onRetry} disabled={isRetryDisabled}>
        Réessayer
      </button>
    </span>
  )
}

export const MessageBubble = ({ body, timestamp, isMine, authorName, status, onRetry, isRetryDisabled }: MessageBubbleProps) => (
  <li className={cn(styles.message, isMine ? styles.mine : styles.theirs, status && styles[status])}>
    <span className="visually-hidden">{isMine ? 'Vous' : authorName} :</span>
    <p className={styles.bubble}>{body}</p>
    {status ? (
      <DeliveryStatus status={status} onRetry={onRetry} isRetryDisabled={isRetryDisabled} />
    ) : (
      // The server and the browser may not share a timezone; the browser's rendering wins.
      <time className={styles.time} dateTime={toIsoString(timestamp)} suppressHydrationWarning>
        {formatMessageTime(timestamp)}
      </time>
    )}
  </li>
)
