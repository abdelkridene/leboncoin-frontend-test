import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { formatRemainingCharacters } from '../helpers/formatRemainingCharacters'
import { MAX_MESSAGE_LENGTH, validateMessageBody } from '../helpers/validateMessageBody'

const LENGTH_WARNING_THRESHOLD = 100
const ANNOUNCEMENT_DELAY_MS = 1000

const describeRemainingCharacters = (count: number) =>
  count <= LENGTH_WARNING_THRESHOLD ? formatRemainingCharacters(count) : null

interface UseMessageComposerOptions {
  onSend: (body: string) => void
  canSend: boolean
}

export const useMessageComposer = ({ onSend, canSend }: UseMessageComposerOptions) => {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const validBody = validateMessageBody(draft)
  const canSubmit = validBody !== null && canSend
  const remainingCharacters = MAX_MESSAGE_LENGTH - draft.length
  // Screen readers hear the count once typing pauses, rather than on every keystroke.
  const announcedRemainingCharacters = useDebouncedValue(remainingCharacters, ANNOUNCEMENT_DELAY_MS)

  const focus = () => textareaRef.current?.focus()

  const submit = () => {
    if (!canSubmit) return
    onSend(validBody)
    setDraft('')
    focus()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    submit()
  }

  return {
    draft,
    setDraft,
    textareaRef,
    canSubmit,
    remainingCharactersLabel: describeRemainingCharacters(remainingCharacters),
    remainingCharactersAnnouncement: describeRemainingCharacters(announcedRemainingCharacters) ?? '',
    handleSubmit,
    handleKeyDown,
    focus,
  }
}
