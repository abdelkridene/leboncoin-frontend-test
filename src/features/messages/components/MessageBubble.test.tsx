import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { MessageBubble } from './MessageBubble'

const renderBubble = (isMine: boolean, body = 'Bonjour') =>
  render(
    <ul>
      <MessageBubble body={body} timestamp={1625637849} isMine={isMine} authorName="Jeremie" />
    </ul>,
  )

describe('MessageBubble', () => {
  it('renders my message aligned as mine with its time', () => {
    renderBubble(true)
    const item = screen.getByRole('listitem')
    expect(item).toHaveClass('mine')
    expect(item).toHaveTextContent(/^Vous :\s*Bonjour/)
    expect(screen.getByText('7 juillet 2021 à 06:04')).toHaveAttribute('datetime', '2021-07-07T06:04:09.000Z')
  })

  it('names the author of the other side', () => {
    renderBubble(false)
    expect(screen.getByRole('listitem')).toHaveClass('theirs')
    expect(screen.getByRole('listitem')).toHaveTextContent(/^Jeremie :\s*Bonjour/)
  })

  it('renders user content as plain text, never as HTML', () => {
    renderBubble(false, '<img src=x onerror="alert(1)">')
    expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderBubble(true)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows a sending indicator instead of the time while pending', () => {
    render(
      <ul>
        <MessageBubble body="Salut" timestamp={1625637849} isMine authorName="Jeremie" status="pending" />
      </ul>,
    )
    expect(screen.getByRole('listitem')).toHaveClass('pending')
    expect(screen.getByText('Envoi…')).toBeInTheDocument()
    expect(screen.queryByRole('time')).not.toBeInTheDocument()
  })

  it('lets the user retry a failed message', async () => {
    const onRetry = jest.fn()
    render(
      <ul>
        <MessageBubble body="Salut" timestamp={1625637849} isMine authorName="Jeremie" status="failed" onRetry={onRetry} />
      </ul>,
    )
    expect(screen.getByText(/Échec de l’envoi/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('disables retry while another message is being sent', () => {
    render(
      <ul>
        <MessageBubble body="Salut" timestamp={1} isMine authorName="Jeremie" status="failed" isRetryDisabled />
      </ul>,
    )
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeDisabled()
  })
})
