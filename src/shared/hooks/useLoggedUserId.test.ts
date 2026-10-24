import { renderHook } from '@testing-library/react'
import { useLoggedUserId } from './useLoggedUserId'

describe('useLoggedUserId', () => {
  it('returns the logged user id', () => {
    const { result } = renderHook(() => useLoggedUserId())
    expect(result.current).toBe(1)
  })
})
