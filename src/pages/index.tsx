import type { ReactElement } from 'react'
import Head from 'next/head'
import { AppLayout } from '@/shared/components/AppLayout'
import { EmptyState } from '@/shared/components/EmptyState'

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Messages - leboncoin</title>
        <meta name="description" content="Consultez et envoyez vos messages leboncoin" />
      </Head>
      <AppLayout activePanel="list" sidebar={<EmptyState title="Aucune conversation" />}>
        <EmptyState title="Sélectionnez une conversation" description="Vos échanges s’afficheront ici." />
      </AppLayout>
    </>
  )
}
