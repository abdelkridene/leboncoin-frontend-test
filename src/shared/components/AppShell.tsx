import type { ReactNode } from 'react'
import Image from 'next/image'
import Logo from '@/assets/lbc-logo.webp'
import { OfflineBanner } from './OfflineBanner'
import { SkipLink } from './SkipLink'
import styles from './AppShell.module.css'

interface AppShellProps {
  children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => (
  <div className={styles.page}>
    <SkipLink />
    <header className={styles.header}>
      <Image src={Logo} alt="leboncoin" width={103} height={32} priority />
      <h1 className={styles.title}>Messages</h1>
    </header>
    <OfflineBanner />
    {children}
  </div>
)
