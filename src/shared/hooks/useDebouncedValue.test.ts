import { act, renderHook } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('follows the value once it stops changing for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 1000), { initialProps: { value: 'a' } })
    expect(result.current).toBe('a')

    rerender({ value: 'ab' })
    act(() => jest.advanceTimersByTime(600))
    rerender({ value: 'abc' })
    act(() => jest.advanceTimersByTime(600))
    expect(result.current).toBe('a')

    act(() => jest.advanceTimersByTime(400))
    expect(result.current).toBe('abc')
  })
})
