import { renderHook } from '@testing-library/react'
import { mockMobileViewport } from '@/test/mockViewport'
import { useIsMobile } from './useIsMobile'

describe('useIsMobile', () => {
  it('is false on desktop viewports', () => {
    expect(renderHook(() => useIsMobile()).result.current).toBe(false)
  })

  it('is true below the desktop breakpoint', () => {
    const restore = mockMobileViewport()
    expect(renderHook(() => useIsMobile()).result.current).toBe(true)
    restore()
  })
})
