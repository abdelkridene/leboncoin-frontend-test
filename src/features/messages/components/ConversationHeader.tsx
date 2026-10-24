import Link from 'next/link'
import { Avatar } from '@/shared/components/Avatar'
import styles from './ConversationHeader.module.css'

interface ConversationHeaderProps {
  interlocutorName: string
}

export const ConversationHeader = ({ interlocutorName }: ConversationHeaderProps) => (
  <header className={styles.header}>
    <Link href="/" className={styles.back} aria-label="Retour aux conversations">
      <span aria-hidden="true">←</span>
    </Link>
    <Avatar name={interlocutorName} />
    <h2 className={styles.title}>{interlocutorName}</h2>
  </header>
)
