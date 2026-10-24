import { render, screen } from '@testing-library/react'
import { useFocusOnMount } from './useFocusOnMount'

const Heading = ({ enabled }: { enabled: boolean }) => {
  const ref = useFocusOnMount<HTMLHeadingElement>(enabled)
  return (
    <h2 ref={ref} tabIndex={-1}>
      Titre
    </h2>
  )
}

describe('useFocusOnMount', () => {
  it('focuses the element when enabled', () => {
    render(<Heading enabled />)
    expect(screen.getByRole('heading')).toHaveFocus()
  })

  it('leaves the focus alone when disabled', () => {
    render(<Heading enabled={false} />)
    expect(screen.getByRole('heading')).not.toHaveFocus()
  })

  it('focuses once it becomes enabled', () => {
    const { rerender } = render(<Heading enabled={false} />)
    rerender(<Heading enabled />)
    expect(screen.getByRole('heading')).toHaveFocus()
  })
})
