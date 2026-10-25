import type { FormEvent, KeyboardEvent, RefObject } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { cn } from '@/shared/helpers/cn'
import { MAX_MESSAGE_LENGTH } from '../../helpers/validateMessageBody'
import styles from './MessageComposer.module.css'

interface MessageComposerProps {
  draft: string
  onDraftChange: (draft: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
  canSubmit: boolean
  remainingCharacters: number
  isNearLimit: boolean
  recipientName: string
}

export const MessageComposer = ({
  draft,
  onDraftChange,
  onSubmit,
  onKeyDown,
  textareaRef,
  canSubmit,
  remainingCharacters,
  isNearLimit,
  recipientName,
}: MessageComposerProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <label htmlFor="message-composer" className="visually-hidden">
      Message à {recipientName}
    </label>
    <textarea
      id="message-composer"
      ref={textareaRef}
      className={styles.input}
      value={draft}
      onChange={(event) => onDraftChange(event.target.value)}
      onKeyDown={onKeyDown}
      maxLength={MAX_MESSAGE_LENGTH}
      rows={1}
      placeholder="Écrire un message"
      aria-describedby="message-composer-counter"
    />
    <p id="message-composer-counter" aria-live="polite" className={cn(styles.counter, !isNearLimit && 'visually-hidden')}>
      {isNearLimit ? `${remainingCharacters} caractères restants` : `${MAX_MESSAGE_LENGTH} caractères maximum`}
    </p>
    <Button type="submit" disabled={!canSubmit} className={styles.send}>
      Envoyer
    </Button>
  </form>
)
