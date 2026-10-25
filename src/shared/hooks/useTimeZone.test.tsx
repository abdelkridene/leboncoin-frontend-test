import { renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useTimeZone } from './useTimeZone'

const TimeZone = () => <p>{useTimeZone()}</p>

describe('useTimeZone', () => {
  afterEach(() => jest.restoreAllMocks())

  it('returns the time zone of the browser', () => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions()
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({ ...resolvedOptions, timeZone: 'Asia/Tokyo' })
    expect(renderHook(() => useTimeZone()).result.current).toBe('Asia/Tokyo')
  })

  it('falls back to Paris when the browser does not tell', () => {
    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions()
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({ ...resolvedOptions, timeZone: '' })
    expect(renderHook(() => useTimeZone()).result.current).toBe('Europe/Paris')
  })

  it('renders with the Paris time zone on the server', () => {
    expect(renderToString(<TimeZone />)).toBe('<p>Europe/Paris</p>')
  })
})
