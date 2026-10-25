import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ConversationListItem } from './ConversationListItem'

const renderItem = (isSelected: boolean) =>
  render(
    <ul>
      <ConversationListItem
        href="/conversations/1"
        interlocutorName="Jeremie"
        lastMessageTimestamp={1625637849}
        isSelected={isSelected}
      />
    </ul>,
  )

describe('ConversationListItem', () => {
  it('links to the conversation and shows the interlocutor and last message date', () => {
    renderItem(false)
    const link = screen.getByRole('link', { name: /Jeremie/ })
    expect(link).toHaveAttribute('href', '/conversations/1')
    expect(link).not.toHaveAttribute('aria-current')
    expect(screen.getByText('07/07/2021')).toHaveAttribute('datetime', '2021-07-07T06:04:09.000Z')
  })

  it('marks the selected conversation', () => {
    renderItem(true)
    expect(screen.getByRole('link', { name: /Jeremie/ })).toHaveAttribute('aria-current', 'page')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderItem(true)
    expect(await axe(container)).toHaveNoViolations()
  })
})
