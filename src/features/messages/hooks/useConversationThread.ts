import { useMessageComposer } from './useMessageComposer'
import { useMessages } from './useMessages'
import { useSendMessage } from './useSendMessage'

export const useConversationThread = (conversationId: number) => {
  const { data: messages, isPending, isError, refetch } = useMessages(conversationId)
  const { outgoingMessages, send, retry, isSending } = useSendMessage(conversationId)
  // Nothing is sent into a conversation whose history is not on screen, and never two messages at once.
  const composer = useMessageComposer({ onSend: send, canSend: messages !== undefined && !isSending })

  return {
    messages,
    isPending,
    isError,
    reload: () => void refetch(),
    outgoingMessages,
    isSending,
    retry,
    composer,
  }
}
