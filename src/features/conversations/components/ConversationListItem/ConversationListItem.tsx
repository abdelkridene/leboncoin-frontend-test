import Link from 'next/link'
import { Avatar } from '@/shared/components/Avatar/Avatar'
import { Timestamp } from '@/shared/components/Timestamp/Timestamp'
import { cn } from '@/shared/helpers/cn'
import { formatConversationDate } from '@/shared/helpers/formatDate'
import styles from './ConversationListItem.module.css'

interface ConversationListItemProps {
  href: string
  interlocutorName: string
  lastMessageTimestamp: number
  isSelected: boolean
  onPrefetch?: () => void
}

export const ConversationListItem = ({
  href,
  interlocutorName,
  lastMessageTimestamp,
  isSelected,
  onPrefetch,
}: ConversationListItemProps) => (
  <li>
    <Link
      href={href}
      aria-current={isSelected ? 'page' : undefined}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={cn(styles.item, isSelected && styles.selected)}
    >
      <Avatar name={interlocutorName} />
      <span className={styles.content}>
        <span className={styles.name}>{interlocutorName}</span>
        <Timestamp value={lastMessageTimestamp} format={formatConversationDate} className={styles.date} />
      </span>
    </Link>
  </li>
)
