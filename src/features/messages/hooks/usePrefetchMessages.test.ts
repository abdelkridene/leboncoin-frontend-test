import { act, waitFor } from '@testing-library/react'
import { messages } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { queryKeys } from '@/api/queryKeys'
import { usePrefetchMessages } from './usePrefetchMessages'

describe('usePrefetchMessages', () => {
  it('warms the messages cache of a conversation', async () => {
    const { result, queryClient } = renderHookWithProviders(() => usePrefetchMessages())
    act(() => result.current(1))
    await waitFor(() => expect(queryClient.getQueryData(queryKeys.messages(1))).toEqual(messages))
  })
})
