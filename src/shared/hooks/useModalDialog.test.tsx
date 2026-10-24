import { render, screen } from '@testing-library/react'
import { useModalDialog } from './useModalDialog'

const Dialog = ({ isOpen }: { isOpen: boolean }) => {
  const ref = useModalDialog(isOpen)
  return (
    <dialog ref={ref} aria-label="Exemple">
      Contenu
    </dialog>
  )
}

describe('useModalDialog', () => {
  it('opens and closes the native dialog with the state', () => {
    const { rerender } = render(<Dialog isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<Dialog isOpen />)
    expect(screen.getByRole('dialog', { name: 'Exemple' })).toBeVisible()

    rerender(<Dialog isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
