import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title, description and action', () => {
    render(
      <EmptyState title="Aucune conversation" description="Commencez à discuter">
        <button type="button">Nouvelle conversation</button>
      </EmptyState>,
    )
    expect(screen.getByText('Aucune conversation')).toBeInTheDocument()
    expect(screen.getByText('Commencez à discuter')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nouvelle conversation' })).toBeInTheDocument()
  })

  it('renders without description', () => {
    const { container } = render(<EmptyState title="Rien ici" />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyState title="Aucune conversation" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
