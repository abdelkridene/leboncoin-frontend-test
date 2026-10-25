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

// Variables are always the NewMessage built by `send` or `retry` below.
const getVariables = (mutation: Mutation<unknown, Error, unknown>) => mutation.state.variables as NewMessage

const toOutgoingMessage = (mutation: Mutation<unknown, Error, unknown>): OutgoingMessage => ({
  ...getVariables(mutation),
  mutationId: mutation.mutationId,
  status: mutation.state.status === 'error' ? 'failed' : 'pending',
})

const isUnsent = (mutation: Mutation<unknown, Error, unknown>) =>
  mutation.state.status === 'pending' || mutation.state.status === 'error'

export const useSendMessage = (conversationId: number) => {
  const queryClient = useQueryClient()
  const authorId = useLoggedUserId()
  const mutationKey = queryKeys.sendMessage(conversationId)

  const { mutateAsync } = useMutation({
    mutationKey,
    mutationFn: sendMessage,
    // The default 5 minutes would garbage collect failed messages once unobserved: they must wait for a retry.
    gcTime: Infinity,
    onSuccess: (message) => {
      // Appended only to a history that was loaded: a lone message must never pass for the whole conversation.
      queryClient.setQueryData<Message[]>(queryKeys.messages(conversationId), (messages) => messages && [...messages, message])
      // Prefix match: updates both the server list and the conversations created locally.
      queryClient.setQueriesData<Conversation[]>({ queryKey: queryKeys.conversations(authorId) }, (conversations) =>
        conversations?.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, lastMessageTimestamp: message.timestamp } : conversation,
        ),
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) })
    },
  })

  const outgoingMessages = useMutationState({ filters: { mutationKey, predicate: isUnsent }, select: toOutgoingMessage })

  const forgetDeliveredMessages = () => {
    const mutationCache = queryClient.getMutationCache()
    mutationCache.findAll({ mutationKey, status: 'success' }).forEach((mutation) => mutationCache.remove(mutation))
  }

  const deliver = async (message: NewMessage) => {
    try {
      await mutateAsync(message)
      forgetDeliveredMessages()
    } catch {
      // The failed mutation stays in the cache, where the conversation shows it with a retry action.
    }
  }

  const send = (body: string) => {
    void deliver({ conversationId, authorId, body, timestamp: toTimestampInSeconds(new Date()) })
  }

  const retry = (mutationId: number) => {
    const mutationCache = queryClient.getMutationCache()
    const failed = mutationCache.getAll().find((mutation) => mutation.mutationId === mutationId)
    if (!failed) return
    mutationCache.remove(failed)
    void deliver({ ...getVariables(failed), timestamp: toTimestampInSeconds(new Date()) })
  }

  return {
    outgoingMessages,
    send,
    retry,
    isSending: outgoingMessages.some(({ status }) => status === 'pending'),
  }
}
