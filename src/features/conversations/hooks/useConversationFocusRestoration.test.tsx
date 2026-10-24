import Link from 'next/link'
import { render, screen } from '@testing-library/react'
import { useRememberViewedConversation, useRestoreConversationFocus } from './useConversationFocusRestoration'

const ViewedConversation = ({ id }: { id: number }) => {
  useRememberViewedConversation(id)
  return null
}

const List = ({ enabled }: { enabled: boolean }) => {
  const ref = useRestoreConversationFocus<HTMLUListElement>(enabled)
  return (
    <ul ref={ref}>
      <li>
        <Link href="/conversations/1">Jeremie</Link>
      </li>
      <li>
        <Link href="/conversations/2">Patrick</Link>
      </li>
    </ul>
  )
}

describe('conversation focus restoration', () => {
  it('focuses the conversation the user came back from, only once', () => {
    const viewed = render(<ViewedConversation id={2} />)
    viewed.unmount()

    const list = render(<List enabled />)
    expect(screen.getByRole('link', { name: 'Patrick' })).toHaveFocus()
    list.unmount()

    render(<List enabled />)
    expect(document.body).toHaveFocus()
  })

  it('waits until restoration is enabled', () => {
    render(<ViewedConversation id={1} />).unmount()
    const { rerender } = render(<List enabled={false} />)
    expect(document.body).toHaveFocus()

    rerender(<List enabled />)
    expect(screen.getByRole('link', { name: 'Jeremie' })).toHaveFocus()
  })
})
