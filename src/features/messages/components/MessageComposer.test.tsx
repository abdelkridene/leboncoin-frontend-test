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
    remainingCharacters: 1000,
    isNearLimit: false,
    recipientName: 'Jeremie',
    ...overrides,
  }
  render(<MessageComposer {...props} />)
  return props
}

describe('MessageComposer', () => {
  it('exposes a labelled, length limited field', async () => {
    const props = renderComposer()
    const field = screen.getByRole('textbox', { name: 'Message à Jeremie' })
    expect(field).toHaveAttribute('maxLength', '1000')
    expect(field).toHaveAccessibleDescription('1000 caractères maximum')

    await userEvent.type(field, 'a')
    expect(props.onDraftChange).toHaveBeenCalledWith('a')
    expect(props.onKeyDown).toHaveBeenCalled()
  })

  it('submits the form', async () => {
    const props = renderComposer()
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }))
    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables sending when not allowed', () => {
    renderComposer({ canSubmit: false })
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeDisabled()
  })

  it('announces the remaining characters near the limit', () => {
    renderComposer({ isNearLimit: true, remainingCharacters: 12 })
    expect(screen.getByText('12 caractères restants')).toHaveAttribute('aria-live', 'polite')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MessageComposer
        draft=""
        onDraftChange={jest.fn()}
        onSubmit={jest.fn()}
        onKeyDown={jest.fn()}
        textareaRef={createRef()}
        canSubmit={false}
        remainingCharacters={1000}
        isNearLimit={false}
        recipientName="Jeremie"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
