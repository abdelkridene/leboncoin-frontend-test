import type { Ref } from 'react'
import Link from 'next/link'
import { Avatar } from '@/shared/components/Avatar/Avatar'
import styles from './ConversationHeader.module.css'

interface ConversationHeaderProps {
  interlocutorName: string
  headingRef?: Ref<HTMLHeadingElement>
}

export const ConversationHeader = ({ interlocutorName, headingRef }: ConversationHeaderProps) => (
  <header className={styles.header}>
    <Link href="/" className={styles.back} aria-label="Retour aux conversations">
      <span aria-hidden="true">←</span>
    </Link>
    <Avatar name={interlocutorName} />
    <h2 ref={headingRef} tabIndex={-1} className={styles.title}>
      {interlocutorName}
    </h2>
  </header>
)
