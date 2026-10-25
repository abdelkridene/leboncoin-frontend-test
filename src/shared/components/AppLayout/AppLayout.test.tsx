import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AppLayout } from './AppLayout'

const renderLayout = (activePanel: 'list' | 'detail') =>
  render(
    <AppLayout activePanel={activePanel} sidebar={<p>Liste</p>}>
      <p>Détail</p>
    </AppLayout>,
  )

describe('AppLayout', () => {
  it('renders the main landmark, the conversations navigation and the detail region', () => {
    renderLayout('list')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByRole('navigation', { name: 'Conversations' })).toHaveTextContent('Liste')
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveTextContent('Détail')
  })

  it('flags which panel is visible on small screens', () => {
    renderLayout('list')
    expect(screen.getByRole('main')).toHaveAttribute('data-active-panel', 'list')
  })

  it('flags the detail panel', () => {
    renderLayout('detail')
    expect(screen.getByRole('main')).toHaveAttribute('data-active-panel', 'detail')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderLayout('detail')
    expect(await axe(container)).toHaveNoViolations()
  })
})
