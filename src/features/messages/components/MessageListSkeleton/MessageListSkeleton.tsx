import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import styles from './MessageListSkeleton.module.css'

const PLACEHOLDER_ALIGNMENTS = ['theirs', 'mine', 'theirs', 'mine'] as const

export const MessageListSkeleton = () => (
  <div role="status" className={styles.container}>
    <span className="visually-hidden">Chargement des messages…</span>
    {PLACEHOLDER_ALIGNMENTS.map((alignment, index) => (
      <Skeleton key={index} shape="block" className={styles[alignment]} />
    ))}
  </div>
)
