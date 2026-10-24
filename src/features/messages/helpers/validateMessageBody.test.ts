import { MAX_MESSAGE_LENGTH, validateMessageBody } from './validateMessageBody'

describe('validateMessageBody', () => {
  it('returns the trimmed body', () => {
    expect(validateMessageBody('  Bonjour \n')).toBe('Bonjour')
  })

  it.each(['', '   ', '\n\t'])('rejects blank messages (%p)', (draft) => {
    expect(validateMessageBody(draft)).toBeNull()
  })

  it('accepts the maximum length and rejects longer messages', () => {
    expect(validateMessageBody('a'.repeat(MAX_MESSAGE_LENGTH))).toHaveLength(MAX_MESSAGE_LENGTH)
    expect(validateMessageBody('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBeNull()
  })
})
