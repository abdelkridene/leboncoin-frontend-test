import { act, render, screen } from '@testing-library/react'
import { OfflineBanner } from './OfflineBanner'

describe('OfflineBanner', () => {
  afterEach(() => jest.restoreAllMocks())

  it('keeps an empty live region while online and announces when offline', () => {
    render(<OfflineBanner />)
    const status = screen.getByRole('status')
    expect(status).toBeEmptyDOMElement()

    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(status).toHaveTextContent('Vous êtes hors ligne')
  })
})
