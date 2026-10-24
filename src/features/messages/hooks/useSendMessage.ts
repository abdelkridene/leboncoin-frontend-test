import { useMutation, useMutationState, useQueryClient, type Mutation } from '@tanstack/react-query'
import { sendMessage, type NewMessage } from '@/api/messages'
import { queryKeys } from '@/api/queryKeys'
import type { Conversation, Message } from '@/api/schemas'
import { toTimestampInSeconds } from '@/shared/helpers/formatDate'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'

export type OutgoingStatus = 'pending' | 'failed'

export interface OutgoingMessage extends NewMessage {
  mutationId: number
  status: OutgoingStatus
}

const toOutgoingMessage = (mutation: Mutation<unknown, Error, unknown>): OutgoingMessage => ({
  // Variables are always the NewMessage built by `send` below.
  ...(mutation.state.variables as NewMessage),
  mutationId: mutation.mutationId,
  status: mutation.state.status === 'error' ? 'failed' : 'pending',
})

const isUnsent = (mutation: Mutation<unknown, Error, unknown>) =>
  mutation.state.status === 'pending' || mutation.state.status === 'error'

export const useSendMessage = (conversationId: number) => {
  const queryClient = useQueryClient()
  const authorId = useLoggedUserId()
  const mutationKey = queryKeys.sendMessage(conversationId)

  const { mutate } = useMutation({
    mutationKey,
    mutationFn: sendMessage,
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(queryKeys.messages(conversationId), (messages = []) => [...messages, message])
      // Prefix match: updates both the server list and the conversations created locally.
      queryClient.setQueriesData<Conversation[]>({ queryKey: queryKeys.conversations(authorId) }, (conversations) =>
        conversations?.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, lastMessageTimestamp: message.timestamp } : conversation,
        ),
      )
    },
  })

  const outgoingMessages = useMutationState({ filters: { mutationKey, predicate: isUnsent }, select: toOutgoingMessage })

  const send = (body: string) =>
    mutate({ conversationId, authorId, body, timestamp: toTimestampInSeconds(new Date()) })

  const retry = (mutationId: number) => {
    const mutationCache = queryClient.getMutationCache()
    const failed = mutationCache.getAll().find((mutation) => mutation.mutationId === mutationId)
    if (!failed) return
    mutationCache.remove(failed)
    mutate(failed.state.variables as NewMessage)
  }

  return {
    outgoingMessages,
    send,
    retry,
    isSending: outgoingMessages.some(({ status }) => status === 'pending'),
  }
}
