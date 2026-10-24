import type { ReactNode } from 'react'
import Image from 'next/image'
import Logo from '@/assets/lbc-logo.webp'
import { cn } from '@/shared/helpers/cn'
import { ErrorBoundary } from './ErrorBoundary'
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink'
import { OfflineBanner } from './OfflineBanner'
import styles from './AppLayout.module.css'

export type ActivePanel = 'list' | 'detail'

interface AppLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  activePanel: ActivePanel
}

export const AppLayout = ({ sidebar, children, activePanel }: AppLayoutProps) => (
  <div className={styles.page}>
    <SkipLink />
    <header className={styles.header}>
      <Image src={Logo} alt="leboncoin" width={103} height={32} priority />
      <h1 className={styles.title}>Messages</h1>
    </header>
    <OfflineBanner />
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className={cn(styles.main, activePanel === 'list' ? styles.showList : styles.showDetail)}>
      <nav aria-label="Conversations" className={styles.sidebar}>
        <ErrorBoundary>{sidebar}</ErrorBoundary>
      </nav>
      <section aria-label="Conversation" className={styles.detail}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </section>
    </main>
  </div>
)
