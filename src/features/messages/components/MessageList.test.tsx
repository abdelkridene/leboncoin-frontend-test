import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { messages } from '@/test/fixtures'
import { MessageList } from './MessageList'

describe('MessageList', () => {
  it('renders the messages in a polite live log', () => {
    render(<MessageList messages={messages} loggedUserId={1} interlocutorName="Jeremie" />)
    const log = screen.getByRole('log', { name: 'Messages avec Jeremie' })
    expect(log).toHaveAttribute('aria-live', 'polite')

    const items = within(log).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('mine')
    expect(items[1]).toHaveClass('theirs')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<MessageList messages={messages} loggedUserId={1} interlocutorName="Jeremie" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
