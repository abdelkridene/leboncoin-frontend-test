import type { Conversation } from '@/api/schemas'
import { getInterlocutor } from '@/features/conversations/helpers/getInterlocutor'
import { useConversation } from '@/features/conversations/hooks/useConversation'
import { useRememberViewedConversation } from '@/features/conversations/hooks/useConversationFocusRestoration'
import { useFocusOnNavigation } from '@/shared/hooks/useFocusOnNavigation'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'

type PanelContent =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'missing' }
  | { status: 'ready'; interlocutorName: string }

const describeContent = (
  isPending: boolean,
  conversation: Conversation | null | undefined,
  loggedUserId: number,
): PanelContent => {
  if (isPending) return { status: 'loading' }
  if (conversation === undefined) return { status: 'error' }
  if (conversation === null) return { status: 'missing' }
  return { status: 'ready', interlocutorName: getInterlocutor(conversation, loggedUserId).nickname }
}

export const useConversationPanel = (conversationId: number) => {
  const loggedUserId = useLoggedUserId()
  const { data: conversation, isPending, refetch } = useConversation(conversationId)
  const headingRef = useFocusOnNavigation<HTMLHeadingElement>(Boolean(conversation))
  useRememberViewedConversation(conversationId)

  return {
    ...describeContent(isPending, conversation, loggedUserId),
    loggedUserId,
    headingRef,
    reload: () => void refetch(),
  }
}
