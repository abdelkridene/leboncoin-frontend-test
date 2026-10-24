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
  it('renders the landmarks, a single page heading and both panels', () => {
    renderLayout('list')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByRole('navigation', { name: 'Conversations' })).toHaveTextContent('Liste')
    expect(screen.getByRole('region', { name: 'Conversation' })).toHaveTextContent('Détail')
    expect(screen.getByRole('link', { name: 'Aller au contenu' })).toBeInTheDocument()
  })

  it('flags which panel is visible on small screens', () => {
    renderLayout('list')
    expect(screen.getByRole('main')).toHaveClass('showList')
  })

  it('flags the detail panel', () => {
    renderLayout('detail')
    expect(screen.getByRole('main')).toHaveClass('showDetail')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderLayout('detail')
    expect(await axe(container)).toHaveNoViolations()
  })
})
