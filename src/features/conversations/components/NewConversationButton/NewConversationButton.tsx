import { Button } from '@/shared/components/Button/Button'
import { useNewConversation } from '../../hooks/useNewConversation'
import { NewConversationDialog } from '../NewConversationDialog/NewConversationDialog'

export const NewConversationButton = () => {
  const dialog = useNewConversation()

  return (
    <>
      <Button variant="secondary" onClick={dialog.open} aria-haspopup="dialog">
        Nouvelle conversation
      </Button>
      <NewConversationDialog
        isOpen={dialog.isOpen}
        onClose={dialog.close}
        recipientsStatus={dialog.recipientsStatus}
        recipients={dialog.recipients}
        onRetryRecipients={dialog.retryRecipients}
        onSelectRecipient={dialog.selectRecipient}
        isCreating={dialog.isCreating}
        hasCreationFailed={dialog.hasCreationFailed}
      />
    </>
  )
}
