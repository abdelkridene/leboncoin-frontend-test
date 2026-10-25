import { useMessageComposer } from './useMessageComposer'
import { useMessages } from './useMessages'
import { useSendMessage } from './useSendMessage'

export const useConversationThread = (conversationId: number) => {
  const { data: messages, isPending, isError, refetch } = useMessages(conversationId)
  const { outgoingMessages, send, retry, isSending } = useSendMessage(conversationId)
  const composer = useMessageComposer({ onSend: send, isSending })

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
