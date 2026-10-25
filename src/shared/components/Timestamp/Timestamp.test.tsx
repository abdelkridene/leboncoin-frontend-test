import { act, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { formatMessageTime } from '@/shared/helpers/formatDate'
import { Timestamp } from './Timestamp'

const SIX_AM_UTC = 1625637849

const mockBrowserTimeZone = (timeZone: string) => {
  const resolvedOptions = Intl.DateTimeFormat().resolvedOptions()
  jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({ ...resolvedOptions, timeZone })
}

describe('Timestamp', () => {
  afterEach(() => jest.restoreAllMocks())

  it('renders a machine readable date formatted in the browser time zone', () => {
    mockBrowserTimeZone('America/New_York')
    render(<Timestamp value={SIX_AM_UTC} format={formatMessageTime} />)
    expect(screen.getByText('7 juillet 2021 à 02:04')).toHaveAttribute('datetime', '2021-07-07T06:04:09.000Z')
  })

  it('hydrates the server rendering without mismatch, then shows the browser time', async () => {
    mockBrowserTimeZone('America/New_York')
    const consoleError = jest.spyOn(console, 'error')
    const timestamp = <Timestamp value={SIX_AM_UTC} format={formatMessageTime} />
    const container = document.createElement('div')
    container.innerHTML = renderToString(timestamp)
    expect(container).toHaveTextContent('7 juillet 2021 à 08:04')

    await act(async () => {
      hydrateRoot(container, timestamp)
    })

    expect(container).toHaveTextContent('7 juillet 2021 à 02:04')
    expect(consoleError).not.toHaveBeenCalled()
  })
})
