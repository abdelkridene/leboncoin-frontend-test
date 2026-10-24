import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import NotFoundPage from '@/pages/404'

describe('404 page', () => {
  it('explains the page does not exist and links back home', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour à mes messages' })).toHaveAttribute('href', '/')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<NotFoundPage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
