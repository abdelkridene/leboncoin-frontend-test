import { waitFor } from '@testing-library/react'
import { users } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import { useUsers } from './useUsers'

describe('useUsers', () => {
  it('does not fetch until enabled', () => {
    const { result } = renderHookWithProviders(() => useUsers(false))
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('loads the users when enabled', async () => {
    const { result } = renderHookWithProviders(() => useUsers(true))
    await waitFor(() => expect(result.current.data).toEqual(users))
  })
})
