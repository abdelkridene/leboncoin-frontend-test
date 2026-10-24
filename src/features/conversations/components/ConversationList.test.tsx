import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { conversations } from '@/test/fixtures'
import { ConversationList } from './ConversationList'

describe('ConversationList', () => {
  it('renders one item per conversation named after the interlocutor', () => {
    render(<ConversationList conversations={conversations} loggedUserId={1} selectedConversationId={3} />)
    const names = screen.getAllByRole('link').map((link) => link.textContent)
    expect(names[0]).toContain('Jeremie')
    expect(names[1]).toContain('Patrick')
    expect(names[2]).toContain('Elodie')
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('Elodie')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ConversationList conversations={conversations} loggedUserId={1} selectedConversationId={null} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
