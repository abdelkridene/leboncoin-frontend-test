import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { useOnlineStatus } from './useOnlineStatus'

const setOnline = (online: boolean) => {
  jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(online)
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

describe('useOnlineStatus', () => {
  afterEach(() => jest.restoreAllMocks())

  it('reflects the browser connectivity and its changes', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    act(() => setOnline(false))
    expect(result.current).toBe(false)

    act(() => setOnline(true))
    expect(result.current).toBe(true)
  })

  it('has a safe default during server rendering', () => {
    const Probe = () => String(useOnlineStatus())
    expect(renderToString(createElement(Probe))).toBe('true')
  })
})
