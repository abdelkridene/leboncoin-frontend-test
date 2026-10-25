import { useState } from 'react'
import { useRouter } from 'next/router'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { getRecipientOptions, type RecipientOption } from '../helpers/getRecipientOptions'
import { useConversations } from './useConversations'
import { useCreateConversation } from './useCreateConversation'
import { useUsers } from './useUsers'

export type RecipientsStatus = 'loading' | 'error' | 'ready'

export const useNewConversation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const loggedUserId = useLoggedUserId()
  const users = useUsers(isOpen)
  const { data: conversations = [] } = useConversations()
  const { create, isPending, isError, reset } = useCreateConversation()
  const sender = users.data?.find(({ id }) => id === loggedUserId)

  const close = () => {
    setIsOpen(false)
    reset()
  }

  const selectRecipient = ({ user, existingConversationId }: RecipientOption) => {
    if (existingConversationId !== null) {
      close()
      void router.push(`/conversations/${existingConversationId}`)
      return
    }
    if (sender && !isPending) create({ sender, recipient: user }, close)
  }

  const recipientsStatus: RecipientsStatus = users.isPending ? 'loading' : sender ? 'ready' : 'error'

  return {
    isOpen,
    open: () => setIsOpen(true),
    close,
    recipientsStatus,
    recipients: users.data ? getRecipientOptions(users.data, conversations, loggedUserId) : [],
    retryRecipients: () => void users.refetch(),
    selectRecipient,
    isCreating: isPending,
    hasCreationFailed: isError,
  }
}
