import styles from './StaleDataNotice.module.css'

interface StaleDataNoticeProps {
  onRetry: () => void
}

export const StaleDataNotice = ({ onRetry }: StaleDataNoticeProps) => (
  <p role="status" className={styles.notice}>
    Connexion instable : ces informations ne sont peut-être pas à jour.
    <button type="button" className={styles.retry} onClick={onRetry}>
      Actualiser
    </button>
  </p>
)
