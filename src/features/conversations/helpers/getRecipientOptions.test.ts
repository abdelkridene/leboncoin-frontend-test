import { conversations, users } from '@/test/fixtures'
import { getRecipientOptions } from './getRecipientOptions'

describe('getRecipientOptions', () => {
  it('lists everybody but me, alphabetically, with their existing conversation', () => {
    const options = getRecipientOptions([...users, { id: 5, nickname: 'Amélie' }], conversations, 1)
    expect(options.map(({ user, existingConversationId }) => [user.nickname, existingConversationId])).toEqual([
      ['Amélie', null],
      ['Elodie', 3],
      ['Jeremie', 1],
      ['Patrick', 2],
    ])
  })

  it('has no existing conversation when there is none', () => {
    expect(getRecipientOptions(users, [], 2).every(({ existingConversationId }) => existingConversationId === null)).toBe(true)
  })
})
