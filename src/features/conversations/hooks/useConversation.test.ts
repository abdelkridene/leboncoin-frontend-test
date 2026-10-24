import { waitFor } from '@testing-library/react'
import { conversations } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useConversation } from './useConversation'

describe('useConversation', () => {
  it('returns the requested conversation', async () => {
    const { result } = renderHookWithProviders(() => useConversation(2))
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.data).toEqual(conversations[1])
  })

  it('returns null for an unknown conversation', async () => {
    const { result } = renderHookWithProviders(() => useConversation(999))
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.data).toBeNull()
  })
})
