import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('announces a friendly default message', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toHaveTextContent('Oups, c’est nous, pas vous')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('offers to retry', async () => {
    const onRetry = jest.fn()
    render(<ErrorState title="Erreur" description="Détail" onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('ErreurDétail')

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ErrorState onRetry={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
