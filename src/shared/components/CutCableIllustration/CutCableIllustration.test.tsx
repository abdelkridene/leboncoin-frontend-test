import { render } from '@testing-library/react'
import { CutCableIllustration } from './CutCableIllustration'

describe('CutCableIllustration', () => {
  it('is hidden from assistive technologies', () => {
    const { container } = render(<CutCableIllustration />)
    const illustration = container.firstElementChild
    expect(illustration?.tagName).toBe('svg')
    expect(illustration).toHaveAttribute('aria-hidden', 'true')
    expect(illustration).toHaveAttribute('focusable', 'false')
  })
})
