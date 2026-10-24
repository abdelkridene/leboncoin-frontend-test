import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a decorative placeholder with the requested shape', () => {
    const { container } = render(<Skeleton shape="circle" className="custom" />)
    const skeleton = container.firstElementChild
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveClass('skeleton', 'circle', 'custom')
  })

  it('defaults to a line', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstElementChild).toHaveClass('line')
  })
})
