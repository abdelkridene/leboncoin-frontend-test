import styles from './SkipLink.module.css'

export const MAIN_CONTENT_ID = 'main-content'

export const SkipLink = () => (
  <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink}>
    Aller au contenu
  </a>
)
