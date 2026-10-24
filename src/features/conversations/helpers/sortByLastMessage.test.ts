import { conversations } from '@/test/fixtures'
import { sortByLastMessage } from './sortByLastMessage'

describe('sortByLastMessage', () => {
  it('puts the most recent conversation first without mutating the input', () => {
    const input = [...conversations]
    expect(sortByLastMessage(input).map(({ id }) => id)).toEqual([3, 1, 2])
    expect(input).toEqual(conversations)
  })
})
