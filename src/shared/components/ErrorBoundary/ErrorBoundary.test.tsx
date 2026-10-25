import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { captureError } from '@/shared/helpers/captureError'
import { ErrorBoundary } from './ErrorBoundary'

jest.mock('@/shared/helpers/captureError')

let shouldThrow = true

const Unstable = () => {
  if (shouldThrow) throw new Error('boom')
  return <p>Contenu</p>
}

const renderBoundary = (resetKey = '/conversations/1') =>
  render(
    <ErrorBoundary resetKey={resetKey}>
      <Unstable />
    </ErrorBoundary>,
  )

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => jest.restoreAllMocks())

  it('renders its children when nothing fails', () => {
    shouldThrow = false
    renderBoundary()
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('shows the friendly error state, reports the error and recovers on retry', async () => {
    renderBoundary()
    expect(screen.getByRole('alert')).toHaveTextContent('Oups, c’est nous, pas vous')
    expect(captureError).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }))

    shouldThrow = false
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('starts afresh when the user navigates elsewhere', () => {
    const { rerender } = renderBoundary('/conversations/1')
    shouldThrow = false

    rerender(
      <ErrorBoundary resetKey="/conversations/1">
        <Unstable />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(
      <ErrorBoundary resetKey="/conversations/2">
        <Unstable />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })
})
