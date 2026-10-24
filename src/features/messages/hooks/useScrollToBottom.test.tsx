import { render } from '@testing-library/react'
import { useScrollToBottom } from './useScrollToBottom'

const ScrollingList = ({ items }: { items: string[] }) => {
  const ref = useScrollToBottom<HTMLDivElement>(items.length)
  return (
    <div ref={ref} data-testid="list">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}

describe('useScrollToBottom', () => {
  it('scrolls to the bottom when the trigger changes', () => {
    const { getByTestId, rerender } = render(<ScrollingList items={['a']} />)
    const list = getByTestId('list')
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 500 })

    rerender(<ScrollingList items={['a', 'b']} />)
    expect(list.scrollTop).toBe(500)
  })
})
