import type { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EmptyState } from '@/shared/components/EmptyState'
import { MAIN_CONTENT_ID } from '@/shared/components/SkipLink'
import styles from './404.module.css'

export default function NotFoundPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Page introuvable - leboncoin</title>
      </Head>
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        <EmptyState title="Cette page n’existe pas" description="Le lien est peut-être erroné ou la page a été supprimée.">
          <Link href="/" className="text-link">
            Retour à mes messages
          </Link>
        </EmptyState>
      </main>
    </>
  )
}
