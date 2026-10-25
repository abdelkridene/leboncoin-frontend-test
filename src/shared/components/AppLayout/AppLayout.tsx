import type { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary'
import { MAIN_CONTENT_ID } from '../SkipLink/SkipLink'
import styles from './AppLayout.module.css'

export type ActivePanel = 'list' | 'detail'

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  activePanel: ActivePanel
}

export const AppLayout = ({ sidebar, children, activePanel }: AppLayoutProps) => {
  // A panel that crashed gets a fresh start on the next page.
  const { asPath } = useRouter()

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} data-active-panel={activePanel} className={styles.main}>
      <nav aria-label="Conversations" className={styles.sidebar}>
        <ErrorBoundary resetKey={asPath}>{sidebar}</ErrorBoundary>
      </nav>
      <section aria-label="Conversation" className={styles.detail}>
        <ErrorBoundary resetKey={asPath}>{children}</ErrorBoundary>
      </section>
    </main>
  )
}
