import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import styles from './ConversationListSkeleton.module.css'

const PLACEHOLDER_COUNT = 4

export const ConversationListSkeleton = () => (
  <div role="status" className={styles.container}>
    <span className="visually-hidden">Chargement des conversations…</span>
    {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
      <div key={index} className={styles.item}>
        <Skeleton shape="circle" />
        <div className={styles.lines}>
          <Skeleton className={styles.name} />
          <Skeleton className={styles.date} />
        </div>
      </div>
    ))}
  </div>
)
