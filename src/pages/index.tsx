import type { ReactElement } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prefetchForPage, type PrefetchedProps } from '@/api/serverPrefetch'
import { ConversationsSidebar } from '@/features/conversations/components/ConversationsSidebar/ConversationsSidebar'
import { NoConversationSelected } from '@/features/conversations/components/NoConversationSelected/NoConversationSelected'
import { conversationsQuery } from '@/features/conversations/hooks/conversationsQuery'
import { AppLayout } from '@/shared/components/AppLayout/AppLayout'
import { getLoggedUserId } from '@/utils/getLoggedUserId'

export const getServerSideProps: GetServerSideProps<PrefetchedProps> = async ({ req }) => ({
  props: await prefetchForPage(req, (queryClient) => [
    queryClient.prefetchQuery(conversationsQuery(getLoggedUserId())),
  ]),
})

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Messages - leboncoin</title>
        <meta name="description" content="Consultez et envoyez vos messages leboncoin" />
      </Head>
      <AppLayout activePanel="list" sidebar={<ConversationsSidebar selectedConversationId={null} />}>
        <NoConversationSelected />
      </AppLayout>
    </>
  )
}
