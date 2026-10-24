import type { ReactNode } from 'react'
import styles from './States.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  children?: ReactNode
}

export const EmptyState = ({ title, description, children }: EmptyStateProps) => (
  <div className={styles.state}>
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {children}
  </div>
)
