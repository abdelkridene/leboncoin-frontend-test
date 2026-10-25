import type { ReactNode } from 'react'
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary'
import { MAIN_CONTENT_ID } from '../SkipLink/SkipLink'
import styles from './AppLayout.module.css'

export type ActivePanel = 'list' | 'detail'

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  activePanel: ActivePanel
}

export const AppLayout = ({ sidebar, children, activePanel }: AppLayoutProps) => (
  <main id={MAIN_CONTENT_ID} tabIndex={-1} data-active-panel={activePanel} className={styles.main}>
    <nav aria-label="Conversations" className={styles.sidebar}>
      <ErrorBoundary>{sidebar}</ErrorBoundary>
    </nav>
    <section aria-label="Conversation" className={styles.detail}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </section>
  </main>
)
