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

  it('shows the error state, reports the error and recovers on retry', async () => {
    const onError = jest.fn()
    const onReset = jest.fn()
    render(
      <ErrorBoundary onError={onError} onReset={onReset}>
        <Unstable />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }), expect.anything())

    shouldThrow = false
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('recovers without callbacks', async () => {
    render(
      <ErrorBoundary>
        <Unstable />
      </ErrorBoundary>,
    )
    shouldThrow = false
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })
})
