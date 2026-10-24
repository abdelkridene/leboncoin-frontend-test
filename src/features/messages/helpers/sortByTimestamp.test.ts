import type { Message } from '@/api/schemas'
import { sortByTimestamp } from './sortByTimestamp'

const message = (id: number, timestamp: number): Message => ({ id, timestamp, conversationId: 1, authorId: 1, body: '' })

describe('sortByTimestamp', () => {
  it('orders messages chronologically, then by id, without mutating the input', () => {
    const input = [message(3, 30), message(2, 10), message(1, 10)]
    expect(sortByTimestamp(input).map(({ id }) => id)).toEqual([1, 2, 3])
    expect(input.map(({ id }) => id)).toEqual([3, 2, 1])
  })
})
