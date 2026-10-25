import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { createConversation } from '@/api/conversations'
import { queryKeys } from '@/api/queryKeys'
import type { Conversation, User } from '@/api/schemas'
import { toTimestampInSeconds } from '@/shared/helpers/formatDate'

interface CreateConversationInput {
  sender: User
  recipient: User
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: ({ sender, recipient }: CreateConversationInput) =>
      createConversation({
        senderId: sender.id,
        senderNickname: sender.nickname,
        recipientId: recipient.id,
        recipientNickname: recipient.nickname,
        lastMessageTimestamp: toTimestampInSeconds(new Date()),
      }),
    onSuccess: (conversation) => {
      queryClient.setQueryData<Conversation[]>(queryKeys.createdConversations(conversation.senderId), (created = []) => [
        ...created,
        conversation,
      ])
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations(conversation.senderId), exact: true })
    },
  })

  const create = (input: CreateConversationInput, onCreated: () => void) =>
    mutation.mutate(input, {
      onSuccess: (conversation) => {
        onCreated()
        void router.push(`/conversations/${conversation.id}`)
      },
    })

  return { create, isPending: mutation.isPending, isError: mutation.isError, reset: mutation.reset }
}
