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

const setup = (isSending = false) => {
  const onSend = jest.fn()
  const hook = renderHook(() => useMessageComposer({ onSend, isSending }))
  return { onSend, ...hook }
}

describe('useMessageComposer', () => {
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

  it('refuses to send while a message is being sent', () => {
    const { result, onSend } = setup(true)
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

  it('counts the remaining characters and flags the approach of the limit', () => {
    const { result } = setup()
    expect(result.current.remainingCharacters).toBe(1000)
    expect(result.current.isNearLimit).toBe(false)

    act(() => result.current.setDraft('a'.repeat(950)))
    expect(result.current.remainingCharacters).toBe(50)
    expect(result.current.isNearLimit).toBe(true)
  })
})
