import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'

let shouldThrow = true

const Unstable = () => {
  if (shouldThrow) throw new Error('boom')
  return <p>Contenu</p>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => jest.restoreAllMocks())

  it('renders its children when nothing fails', () => {
    shouldThrow = false
    render(
      <ErrorBoundary>
        <Unstable />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('shows the friendly error state and recovers on retry', async () => {
    render(
      <ErrorBoundary>
        <Unstable />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Oups, c’est nous, pas vous')

    shouldThrow = false
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })
})
