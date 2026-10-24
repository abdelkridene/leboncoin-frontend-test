import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useMediaQuery } from './useMediaQuery'

const mockMatchMedia = (initialMatches: boolean) => {
  let matches = initialMatches
  const listeners = new Set<() => void>()
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    get matches() {
      return matches
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }))
  return {
    change: (next: boolean) => {
      matches = next
      listeners.forEach((listener) => listener())
    },
    listenerCount: () => listeners.size,
  }
}

describe('useMediaQuery', () => {
  it('returns whether the query matches and follows changes', () => {
    const media = mockMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => media.change(true))
    expect(result.current).toBe(true)
  })

  it('unsubscribes on unmount', () => {
    const media = mockMatchMedia(true)
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(media.listenerCount()).toBe(1)

    unmount()
    expect(media.listenerCount()).toBe(0)
  })

  it('has a safe default during server rendering', () => {
    const Probe = () => String(useMediaQuery('(min-width: 768px)'))
    expect(renderToString(createElement(Probe))).toBe('false')
  })
})
