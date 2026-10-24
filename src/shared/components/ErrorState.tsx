import { Button } from './Button'
import styles from './States.module.css'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Oups, c’est nous, pas vous',
  description = 'Nos serveurs font une petite pause. Réessayez dans quelques instants.',
  onRetry,
}: ErrorStateProps) => (
  <div role="alert" className={styles.state}>
    <p className={styles.title}>{title}</p>
    <p className={styles.description}>{description}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
)
