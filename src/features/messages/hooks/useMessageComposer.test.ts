import { act, renderHook } from '@testing-library/react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useMessageComposer } from './useMessageComposer'

const submitEvent = () => ({ preventDefault: jest.fn() }) as unknown as FormEvent<HTMLFormElement>

const keyEvent = (key: string, options: { shiftKey?: boolean; isComposing?: boolean } = {}) =>
  ({
    key,
    shiftKey: options.shiftKey ?? false,
    nativeEvent: { isComposing: options.isComposing ?? false },
    preventDefault: jest.fn(),
  }) as unknown as KeyboardEvent<HTMLTextAreaElement>

const setup = (canSend = true) => {
  const onSend = jest.fn()
  const hook = renderHook(() => useMessageComposer({ onSend, canSend }))
  return { onSend, ...hook }
}

describe('useMessageComposer', () => {
  afterEach(() => jest.useRealTimers())

  it('sends the trimmed draft and clears it', () => {
    const { result, onSend } = setup()
    act(() => result.current.setDraft('  Bonjour  '))
    expect(result.current.canSubmit).toBe(true)

    const event = submitEvent()
    act(() => result.current.handleSubmit(event))
    expect(event.preventDefault).toHaveBeenCalled()
    expect(onSend).toHaveBeenCalledWith('Bonjour')
    expect(result.current.draft).toBe('')
  })

  it('refuses blank drafts', () => {
    const { result, onSend } = setup()
    act(() => result.current.setDraft('   '))
    expect(result.current.canSubmit).toBe(false)
    act(() => result.current.handleSubmit(submitEvent()))
    expect(onSend).not.toHaveBeenCalled()
  })

  it('refuses to send when sending is not allowed', () => {
    const { result, onSend } = setup(false)
    act(() => result.current.setDraft('Bonjour'))
    act(() => result.current.handleSubmit(submitEvent()))
    expect(onSend).not.toHaveBeenCalled()
    expect(result.current.draft).toBe('Bonjour')
  })

  it('sends on Enter but keeps Shift+Enter and IME composition for new lines', () => {
    const { result, onSend } = setup()
    act(() => result.current.setDraft('Bonjour'))

    act(() => result.current.handleKeyDown(keyEvent('Enter', { shiftKey: true })))
    act(() => result.current.handleKeyDown(keyEvent('Enter', { isComposing: true })))
    act(() => result.current.handleKeyDown(keyEvent('a')))
    expect(onSend).not.toHaveBeenCalled()

    const enter = keyEvent('Enter')
    act(() => result.current.handleKeyDown(enter))
    expect(enter.preventDefault).toHaveBeenCalled()
    expect(onSend).toHaveBeenCalledWith('Bonjour')
  })

  it('shows the remaining characters only near the limit', () => {
    const { result } = setup()
    expect(result.current.remainingCharactersLabel).toBeNull()

    act(() => result.current.setDraft('a'.repeat(999)))
    expect(result.current.remainingCharactersLabel).toBe('1 caractère restant')
  })

  it('announces the remaining characters once typing pauses', () => {
    jest.useFakeTimers()
    const { result } = setup()
    act(() => result.current.setDraft('a'.repeat(950)))
    expect(result.current.remainingCharactersAnnouncement).toBe('')

    act(() => jest.advanceTimersByTime(1000))
    expect(result.current.remainingCharactersAnnouncement).toBe('50 caractères restants')
  })
})
