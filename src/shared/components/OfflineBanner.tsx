import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import styles from './OfflineBanner.module.css'

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  return (
    <div role="status">
      {!isOnline && (
        <p className={styles.banner}>Vous êtes hors ligne. Vérifiez votre connexion internet.</p>
      )}
    </div>
  )
}
