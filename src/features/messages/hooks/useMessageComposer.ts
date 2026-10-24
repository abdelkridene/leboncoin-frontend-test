import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { MAX_MESSAGE_LENGTH, validateMessageBody } from '../helpers/validateMessageBody'

const LENGTH_WARNING_THRESHOLD = 100

interface UseMessageComposerOptions {
  onSend: (body: string) => void
  isSending: boolean
}

export const useMessageComposer = ({ onSend, isSending }: UseMessageComposerOptions) => {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const validBody = validateMessageBody(draft)
  const canSubmit = validBody !== null && !isSending
  const remainingCharacters = MAX_MESSAGE_LENGTH - draft.length

  const submit = () => {
    if (!canSubmit) return
    onSend(validBody)
    setDraft('')
    textareaRef.current?.focus()
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
    remainingCharacters,
    isNearLimit: remainingCharacters <= LENGTH_WARNING_THRESHOLD,
    handleSubmit,
    handleKeyDown,
  }
}
