import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { MessageComposer } from './MessageComposer'

const renderComposer = (overrides: Partial<Parameters<typeof MessageComposer>[0]> = {}) => {
  const props = {
    draft: '',
    onDraftChange: jest.fn(),
    onSubmit: jest.fn((event) => event.preventDefault()),
    onKeyDown: jest.fn(),
    textareaRef: createRef<HTMLTextAreaElement>(),
    canSubmit: true,
    remainingCharactersLabel: null,
    remainingCharactersAnnouncement: '',
    recipientName: 'Jeremie',
    ...overrides,
  }
  const view = render(<MessageComposer {...props} />)
  return { props, ...view }
}

describe('MessageComposer', () => {
  it('exposes a labelled, length limited field', async () => {
    const { props } = renderComposer()
    const field = screen.getByRole('textbox', { name: 'Message à Jeremie' })
    expect(field).toHaveAttribute('maxLength', '1000')
    expect(field).toHaveAccessibleDescription('1000 caractères maximum')

    await userEvent.type(field, 'a')
    expect(props.onDraftChange).toHaveBeenCalledWith('a')
    expect(props.onKeyDown).toHaveBeenCalled()
  })

  it('submits the form', async () => {
    const { props } = renderComposer()
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }))
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables sending when not allowed', () => {
    renderComposer({ canSubmit: false })
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeDisabled()
  })

  it('shows the counter to sighted users and announces it through a polite live region', () => {
    const { container } = renderComposer({
      remainingCharactersLabel: '12 caractères restants',
      remainingCharactersAnnouncement: '15 caractères restants',
    })
    expect(screen.getByText('12 caractères restants')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('15 caractères restants')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderComposer({ canSubmit: false, remainingCharactersLabel: '12 caractères restants' })
    expect(await axe(container)).toHaveNoViolations()
  })
})
