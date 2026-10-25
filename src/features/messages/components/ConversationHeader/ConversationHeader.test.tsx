import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ConversationHeader } from './ConversationHeader'

describe('ConversationHeader', () => {
  it('shows the interlocutor and a way back to the list', () => {
    render(<ConversationHeader interlocutorName="Jeremie" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Jeremie' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour aux conversations' })).toHaveAttribute('href', '/')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ConversationHeader interlocutorName="Jeremie" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
