import { render } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('shows the uppercase initial and is hidden from assistive technologies', () => {
    const { container } = render(<Avatar name="élodie" />)
    const avatar = container.firstElementChild
    expect(avatar).toHaveTextContent('É')
    expect(avatar).toHaveAttribute('aria-hidden', 'true')
  })

  it('falls back to a placeholder for blank names', () => {
    const { container } = render(<Avatar name="  " />)
    expect(container).toHaveTextContent('?')
  })

  it('always gives the same color to the same name', () => {
    const first = render(<Avatar name="Jeremie" />).container.firstElementChild?.className
    const second = render(<Avatar name="Jeremie" />).container.firstElementChild?.className
    expect(first).toBe(second)
    expect(first).toMatch(/color[1-5]/)
  })
})
