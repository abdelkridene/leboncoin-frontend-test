import type { ReactNode } from 'react'
import { Button } from './Button'
import styles from './States.module.css'

interface ErrorStateProps {
  title?: string
  description?: string
  illustration?: ReactNode
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Oups, c’est nous, pas vous',
  description = 'Nos serveurs font une petite pause. Réessayez dans quelques instants.',
  illustration,
  onRetry,
}: ErrorStateProps) => (
  <div role="alert" className={styles.state}>
    {illustration}
    <p className={styles.title}>{title}</p>
    <p className={styles.description}>{description}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
)
