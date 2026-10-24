import type { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EmptyState } from '@/shared/components/EmptyState'
import styles from './404.module.css'

export default function NotFoundPage(): ReactElement {
  return (
    <>
      <Head>
        <title>Page introuvable - leboncoin</title>
      </Head>
      <main className={styles.main}>
        <h1 className="visually-hidden">Page introuvable</h1>
        <EmptyState title="Cette page n’existe pas" description="Le lien est peut-être erroné ou la page a été supprimée.">
          <Link href="/" className="text-link">
            Retour à mes messages
          </Link>
        </EmptyState>
      </main>
    </>
  )
}
