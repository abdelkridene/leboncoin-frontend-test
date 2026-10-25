import Head from 'next/head'
import Link from 'next/link'
import { CutCableIllustration } from '@/shared/components/CutCableIllustration/CutCableIllustration'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { useConversationPanel } from '../../hooks/useConversationPanel'
import { ConversationHeader } from '../ConversationHeader/ConversationHeader'
import { ConversationThread } from '../ConversationThread/ConversationThread'
import { MessageListSkeleton } from '../MessageListSkeleton/MessageListSkeleton'

interface ConversationPanelProps {
  conversationId: number
}

interface PanelContentProps extends ConversationPanelProps {
  panel: ReturnType<typeof useConversationPanel>
}

const PanelContent = ({ panel, conversationId }: PanelContentProps) => {
  if (panel.status === 'loading') return <MessageListSkeleton />
  if (panel.status === 'error') {
    return (
      <ErrorState
        illustration={<CutCableIllustration />}
        description="Impossible de charger la conversation."
        onRetry={panel.reload}
      />
    )
  }
  if (panel.status === 'missing') {
    return (
      <EmptyState title="Conversation introuvable" description="Elle a peut-être été supprimée.">
        <Link href="/" className="text-link">
          Retour aux conversations
        </Link>
      </EmptyState>
    )
  }

  return (
    <>
      <ConversationHeader interlocutorName={panel.interlocutorName} headingRef={panel.headingRef} />
      <ConversationThread
        conversationId={conversationId}
        loggedUserId={panel.loggedUserId}
        interlocutorName={panel.interlocutorName}
      />
    </>
  )
}

export const ConversationPanel = ({ conversationId }: ConversationPanelProps) => {
  const panel = useConversationPanel(conversationId)
  const subject = panel.status === 'ready' ? panel.interlocutorName : 'Conversation'

  return (
    <>
      <Head>
        <title>{`${subject} - Messages - leboncoin`}</title>
      </Head>
      <PanelContent panel={panel} conversationId={conversationId} />
    </>
  )
}
