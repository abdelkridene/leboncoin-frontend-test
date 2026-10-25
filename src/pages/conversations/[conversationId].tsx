import type { ReactElement } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prefetchForPage, type PrefetchedProps } from '@/api/serverPrefetch'
import { ConversationsSidebar } from '@/features/conversations/components/ConversationsSidebar/ConversationsSidebar'
import { conversationsQuery } from '@/features/conversations/hooks/conversationsQuery'
import { ConversationPanel } from '@/features/messages/components/ConversationPanel/ConversationPanel'
import { messagesQuery } from '@/features/messages/hooks/messagesQuery'
import { AppLayout } from '@/shared/components/AppLayout/AppLayout'
import { parseRouteId } from '@/shared/helpers/parseRouteId'
import { getLoggedUserId } from '@/utils/getLoggedUserId'

interface ConversationPageProps extends PrefetchedProps {
  conversationId: number
}

export const getServerSideProps: GetServerSideProps<ConversationPageProps> = async ({ params, req }) => {
  const conversationId = parseRouteId(params?.conversationId)
  if (conversationId === null) return { notFound: true }

  const userConversations = conversationsQuery(getLoggedUserId())
  const { dehydratedState, queryClient } = await prefetchForPage(req, (client) => [
    client.prefetchQuery(userConversations),
    client.prefetchQuery(messagesQuery(conversationId)),
  ])

  const conversations = queryClient?.getQueryData(userConversations.queryKey)
  if (conversations && !conversations.some(({ id }) => id === conversationId)) return { notFound: true }

  return { props: { dehydratedState, conversationId } }
}

export default function ConversationPage({ conversationId }: ConversationPageProps): ReactElement {
  return (
    <>
      <Head>
        <meta name="description" content="Échangez avec les autres membres leboncoin" />
      </Head>
      <AppLayout activePanel="detail" sidebar={<ConversationsSidebar selectedConversationId={conversationId} />}>
        <ConversationPanel key={conversationId} conversationId={conversationId} />
      </AppLayout>
    </>
  )
}
