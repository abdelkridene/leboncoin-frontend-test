import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { users } from '@/test/fixtures'
import { NewConversationDialog } from './NewConversationDialog'

const recipients = users.slice(1).map((user, index) => ({ user, existingConversationId: index === 0 ? 1 : null }))

const dialogProps = (overrides: Partial<Parameters<typeof NewConversationDialog>[0]> = {}) => ({
  isOpen: true,
  onClose: jest.fn(),
  recipientsStatus: 'ready' as const,
  recipients,
  onRetryRecipients: jest.fn(),
  onSelectRecipient: jest.fn(),
  isCreating: false,
  hasCreationFailed: false,
  ...overrides,
})

const renderDialog = (overrides: Partial<Parameters<typeof NewConversationDialog>[0]> = {}) => {
  const props = dialogProps(overrides)
  render(<NewConversationDialog {...props} />)
  return props
}

describe('NewConversationDialog', () => {
  it('lists the recipients and selects one', async () => {
    const props = renderDialog()
    expect(screen.getByRole('dialog', { name: 'Nouvelle conversation' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Patrick' }))
    expect(props.onSelectRecipient).toHaveBeenCalledWith(recipients[1])
  })

  it('flags the people I already talk with', () => {
    renderDialog()
    expect(screen.getByRole('button', { name: /Jeremie/ })).toHaveTextContent('Conversation en cours')
    expect(screen.getByRole('button', { name: 'Patrick' })).not.toHaveTextContent('Conversation en cours')
  })

  it('closes with the close button', async () => {
    const props = renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(props.onClose).toHaveBeenCalled()
  })

  it('shows loading, error and empty states', async () => {
    const { unmount } = render(<NewConversationDialog {...dialogProps({ recipientsStatus: 'loading' })} />)
    expect(screen.queryAllByRole('button', { name: /Jeremie/ })).toHaveLength(0)
    unmount()

    const props = dialogProps({ recipientsStatus: 'error' })
    const errorView = render(<NewConversationDialog {...props} />)
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(props.onRetryRecipients).toHaveBeenCalled()
    errorView.unmount()

    render(<NewConversationDialog {...dialogProps({ recipients: [] })} />)
    expect(screen.getByText('Aucun contact disponible')).toBeInTheDocument()
  })

  it('disables the recipients while creating and reports failures', () => {
    renderDialog({ isCreating: true, hasCreationFailed: true })
    expect(screen.getByRole('button', { name: /Jeremie/ })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('La conversation n’a pas pu être créée.')
  })

  it('has no accessibility violations', async () => {
    renderDialog()
    expect(await axe(document.body)).toHaveNoViolations()
  })
})

