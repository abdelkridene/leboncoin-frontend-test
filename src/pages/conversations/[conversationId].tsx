import type { ReactElement } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prefetchForPage, type PrefetchedProps } from '@/api/serverPrefetch'
import { ConversationsSidebar } from '@/features/conversations/components/ConversationsSidebar'
import { conversationsQuery } from '@/features/conversations/hooks/conversationsQuery'
import { ConversationPanel } from '@/features/messages/components/ConversationPanel'
import { messagesQuery } from '@/features/messages/hooks/messagesQuery'
import { AppLayout } from '@/shared/components/AppLayout'
import { parseRouteId } from '@/shared/helpers/parseRouteId'
import { getLoggedUserId } from '@/utils/getLoggedUserId'

interface ConversationPageProps extends PrefetchedProps {
  conversationId: number
}

export const getServerSideProps: GetServerSideProps<ConversationPageProps> = async ({ params, req }) => {
  const conversationId = parseRouteId(params?.conversationId)
  if (conversationId === null) return { notFound: true }

  const prefetched = await prefetchForPage(req, (queryClient) => [
    queryClient.prefetchQuery(conversationsQuery(getLoggedUserId())),
    queryClient.prefetchQuery(messagesQuery(conversationId)),
  ])
  return { props: { ...prefetched, conversationId } }
}

export default function ConversationPage({ conversationId }: ConversationPageProps): ReactElement {
  return (
    <>
      <Head>
        <title>Conversation - Messages - leboncoin</title>
      </Head>
      <AppLayout activePanel="detail" sidebar={<ConversationsSidebar selectedConversationId={conversationId} />}>
        <ConversationPanel key={conversationId} conversationId={conversationId} />
      </AppLayout>
    </>
  )
}
