import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/shared/components/Button/Button'
import { useLoggedUserId } from '@/shared/hooks/useLoggedUserId'
import { getRecipientOptions, type RecipientOption } from '../../helpers/getRecipientOptions'
import { useConversations } from '../../hooks/useConversations'
import { useCreateConversation } from '../../hooks/useCreateConversation'
import { useUsers } from '../../hooks/useUsers'
import { NewConversationDialog, type RecipientsStatus } from '../NewConversationDialog/NewConversationDialog'

export const NewConversationButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const loggedUserId = useLoggedUserId()
  const users = useUsers(isOpen)
  const { data: conversations = [] } = useConversations()
  const { create, isPending, isError, reset } = useCreateConversation()
  const sender = users.data?.find(({ id }) => id === loggedUserId)

  const recipientsStatus: RecipientsStatus = users.isPending ? 'loading' : sender ? 'ready' : 'error'
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

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
        Nouvelle conversation
      </Button>
      <NewConversationDialog
        isOpen={isOpen}
        onClose={close}
        recipientsStatus={recipientsStatus}
        recipients={users.data ? getRecipientOptions(users.data, conversations, loggedUserId) : []}
        onRetryRecipients={() => users.refetch()}
        onSelectRecipient={selectRecipient}
        isCreating={isPending}
        hasCreationFailed={isError}
      />
    </>
  )
}
