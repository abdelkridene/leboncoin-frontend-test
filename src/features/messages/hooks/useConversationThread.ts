import { useMessageComposer } from './useMessageComposer'
import { useMessages } from './useMessages'
import { useSendMessage } from './useSendMessage'

export const useConversationThread = (conversationId: number) => {
  const { data: messages, isPending, isError, refetch } = useMessages(conversationId)
  const { outgoingMessages, send, retry, isSending } = useSendMessage(conversationId)
  // Nothing is sent into a conversation whose history is not on screen, and never two messages at once.
  const composer = useMessageComposer({ onSend: send, canSend: messages !== undefined && !isSending })

  const retryMessage = (mutationId: number) => {
    retry(mutationId)
    // The retry button disappears with the failed message: the focus goes back where the user writes.
    composer.focus()
  }

  return {
    messages,
    isPending,
    isError,
    reload: () => void refetch(),
    outgoingMessages,
    isSending,
    retry: retryMessage,
    composer,
  }
}
