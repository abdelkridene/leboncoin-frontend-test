import { render, screen } from '@testing-library/react'
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('links to the main content', () => {
    render(<SkipLink />)
    expect(screen.getByRole('link', { name: 'Aller au contenu' })).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`)
  })
})
