import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import styles from './OfflineBanner.module.css'

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  return (
    <div role="status">
      {!isOnline && (
        <p className={styles.banner}>Vous êtes hors ligne. Vos messages partiront dès le retour de la connexion.</p>
      )}
    </div>
  )
}
