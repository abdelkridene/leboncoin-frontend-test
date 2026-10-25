import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  illustration?: ReactNode
  role?: 'alert'
  children?: ReactNode
}

export const EmptyState = ({ title, description, illustration, role, children }: EmptyStateProps) => (
  <div role={role} className={styles.state}>
    {illustration}
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {children}
  </div>
)
