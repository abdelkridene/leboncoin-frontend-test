import { act, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { useFocusOnNavigation } from './useFocusOnNavigation'

const Heading = ({ enabled }: { enabled: boolean }) => {
  const ref = useFocusOnNavigation<HTMLHeadingElement>(enabled)
  return (
    <h2 ref={ref} tabIndex={-1}>
      Titre
    </h2>
  )
}

describe('useFocusOnNavigation', () => {
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

  it('keeps the default focus of the browser on the initial page load', async () => {
    const container = document.body.appendChild(document.createElement('div'))
    container.innerHTML = renderToString(<Heading enabled />)

    await act(async () => {
      hydrateRoot(container, <Heading enabled />)
    })

    expect(container.querySelector('h2')).not.toHaveFocus()
    container.remove()
  })
})
