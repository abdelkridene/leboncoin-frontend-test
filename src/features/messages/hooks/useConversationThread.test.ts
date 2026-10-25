import { act, waitFor } from '@testing-library/react'
import type { FormEvent } from 'react'
import { messages } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useConversationThread } from './useConversationThread'

const submitEvent = () => ({ preventDefault: jest.fn() }) as unknown as FormEvent<HTMLFormElement>

describe('useConversationThread', () => {
  it('loads the history of the conversation', async () => {
    const { result } = renderHookWithProviders(() => useConversationThread(1))
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.messages).toEqual(messages))
  })

  it('sends the draft of the composer to the conversation', async () => {
    const { result } = renderHookWithProviders(() => useConversationThread(1))
    await waitFor(() => expect(result.current.messages).toBeDefined())

    act(() => result.current.composer.setDraft('Toujours dispo ?'))
    act(() => result.current.composer.handleSubmit(submitEvent()))

    await waitFor(() => expect(result.current.messages?.at(-1)?.body).toBe('Toujours dispo ?'))
    expect(result.current.outgoingMessages).toHaveLength(0)
  })
})
