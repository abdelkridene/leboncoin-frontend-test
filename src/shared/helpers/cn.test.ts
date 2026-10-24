import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, 'b', null, undefined, '', 'c')).toBe('a b c')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, undefined)).toBe('')
  })
})
