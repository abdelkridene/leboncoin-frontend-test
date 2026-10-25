import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { messages } from '@/test/fixtures'
import type { OutgoingMessage } from '../../hooks/useSendMessage'
import { MessageList } from './MessageList'

const failedMessage: OutgoingMessage = {
  mutationId: 9,
  conversationId: 1,
  authorId: 1,
  body: 'Toujours là ?',
  timestamp: 1625700000,
  status: 'failed',
}

const renderList = (outgoingMessages: OutgoingMessage[] = [], onRetry = jest.fn()) =>
  render(
    <MessageList
      messages={messages}
      outgoingMessages={outgoingMessages}
      loggedUserId={1}
      interlocutorName="Jeremie"
      onRetry={onRetry}
      isSending={false}
    />,
  )

describe('MessageList', () => {
  it('renders the messages in a polite live log', () => {
    renderList()
    const log = screen.getByRole('log', { name: 'Messages avec Jeremie' })
    expect(log).toHaveAttribute('aria-live', 'polite')
    expect(log).toHaveAttribute('tabindex', '0')

    const items = within(log).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('mine')
    expect(items[1]).toHaveClass('theirs')
  })

  it('appends unsent messages after the delivered ones and retries them', async () => {
    const onRetry = jest.fn()
    renderList([failedMessage], onRetry)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[2]).toHaveTextContent('Toujours là ?')

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onRetry).toHaveBeenCalledWith(9)
  })

  it('has no accessibility violations', async () => {
    const { container } = renderList([failedMessage])
    expect(await axe(container)).toHaveNoViolations()
  })
})
