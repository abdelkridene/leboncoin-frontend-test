import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from './Button'

describe('Button', () => {
  it('is a non submitting button by default and handles clicks', async () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Envoyer</Button>)
    const button = screen.getByRole('button', { name: 'Envoyer' })

    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies the variant and extra class names', () => {
    render(
      <Button variant="ghost" className="extra" type="submit">
        Retour
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Retour' })
    expect(button).toHaveClass('button', 'ghost', 'extra')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('does not fire clicks when disabled', async () => {
    const onClick = jest.fn()
    render(
      <Button onClick={onClick} disabled>
        Envoyer
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Envoyer</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
