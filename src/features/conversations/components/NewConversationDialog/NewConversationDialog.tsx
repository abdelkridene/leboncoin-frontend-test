import { Avatar } from '@/shared/components/Avatar/Avatar'
import { Button } from '@/shared/components/Button/Button'
import { EmptyState } from '@/shared/components/EmptyState/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState/ErrorState'
import { Skeleton } from '@/shared/components/Skeleton/Skeleton'
import { useModalDialog } from '@/shared/hooks/useModalDialog'
import type { RecipientOption } from '../../helpers/getRecipientOptions'
import styles from './NewConversationDialog.module.css'

export type RecipientsStatus = 'loading' | 'error' | 'ready'

interface NewConversationDialogProps {
  isOpen: boolean
  onClose: () => void
  recipientsStatus: RecipientsStatus
  recipients: RecipientOption[]
  onRetryRecipients: () => void
  onSelectRecipient: (recipient: RecipientOption) => void
  isCreating: boolean
  hasCreationFailed: boolean
}

const RecipientList = ({
  recipientsStatus,
  recipients,
  onRetryRecipients,
  onSelectRecipient,
  isCreating,
}: Omit<NewConversationDialogProps, 'isOpen' | 'onClose' | 'hasCreationFailed'>) => {
  if (recipientsStatus === 'loading') return <Skeleton shape="block" />
  if (recipientsStatus === 'error') {
    return <ErrorState description="Impossible de charger les contacts." onRetry={onRetryRecipients} />
  }
  if (recipients.length === 0) return <EmptyState title="Aucun contact disponible" />
  return (
    <ul className={styles.list}>
      {recipients.map((recipient) => (
        <li key={recipient.user.id}>
          <button
            type="button"
            className={styles.recipient}
            onClick={() => onSelectRecipient(recipient)}
            disabled={isCreating}
          >
            <Avatar name={recipient.user.nickname} />
            <span className={styles.recipientText}>
              {recipient.user.nickname}
              {recipient.existingConversationId !== null && (
                <span className={styles.hint}>Conversation en cours</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export const NewConversationDialog = ({ isOpen, onClose, hasCreationFailed, ...listProps }: NewConversationDialogProps) => {
  const dialogRef = useModalDialog(isOpen)

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="new-conversation-title" onClose={onClose}>
      <div className={styles.header}>
        <h2 id="new-conversation-title" className={styles.title}>
          Nouvelle conversation
        </h2>
        <Button variant="ghost" onClick={onClose} aria-label="Fermer">
          <span aria-hidden="true">✕</span>
        </Button>
      </div>
      {hasCreationFailed && (
        <p role="alert" className={styles.error}>
          La conversation n’a pas pu être créée. Réessayez dans un instant.
        </p>
      )}
      <RecipientList {...listProps} />
    </dialog>
  )
}
