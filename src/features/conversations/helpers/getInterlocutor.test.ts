import { conversations } from '@/test/fixtures'
import { getInterlocutor } from './getInterlocutor'

describe('getInterlocutor', () => {
  it('returns the recipient when I started the conversation', () => {
    expect(getInterlocutor(conversations[0], 1)).toEqual({ id: 2, nickname: 'Jeremie' })
  })

  it('returns the sender when the other user started it', () => {
    expect(getInterlocutor(conversations[2], 1)).toEqual({ id: 4, nickname: 'Elodie' })
  })
})
