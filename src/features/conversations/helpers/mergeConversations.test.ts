import { conversations } from '@/test/fixtures'
import { mergeConversations } from './mergeConversations'

const created = { ...conversations[0], id: 10, recipientId: 4, recipientNickname: 'Elodie' }

describe('mergeConversations', () => {
  it('adds the locally created conversations the server does not return yet', () => {
    expect(mergeConversations(conversations, [created]).map(({ id }) => id)).toEqual([1, 2, 3, 10])
  })

  it('prefers the server version once it knows the conversation', () => {
    const serverVersion = { ...created, lastMessageTimestamp: 1 }
    expect(mergeConversations([serverVersion], [created])).toEqual([serverVersion])
  })
})
