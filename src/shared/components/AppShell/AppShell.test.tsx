import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AppShell } from './AppShell'

const renderShell = () =>
  render(
    <AppShell>
      <main id="main-content">Contenu</main>
    </AppShell>,
  )

describe('AppShell', () => {
  it('renders the skip link, the banner with the single page heading and the page', () => {
    renderShell()
    expect(screen.getByRole('link', { name: 'Aller au contenu' })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'leboncoin' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('main')).toHaveTextContent('Contenu')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderShell()
    expect(await axe(container)).toHaveNoViolations()
  })
})
