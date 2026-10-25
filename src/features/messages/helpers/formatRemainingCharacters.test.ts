import { formatRemainingCharacters } from './formatRemainingCharacters'

describe('formatRemainingCharacters', () => {
  it('uses the singular for 0 and 1, as French does', () => {
    expect(formatRemainingCharacters(0)).toBe('0 caractère restant')
    expect(formatRemainingCharacters(1)).toBe('1 caractère restant')
  })

  it('uses the plural from 2', () => {
    expect(formatRemainingCharacters(2)).toBe('2 caractères restants')
    expect(formatRemainingCharacters(100)).toBe('100 caractères restants')
  })
})
