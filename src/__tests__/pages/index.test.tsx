import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import Home from '@/pages/index'

describe('Home page', () => {
  it('renders the page heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: 'Messages' })).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Home />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
