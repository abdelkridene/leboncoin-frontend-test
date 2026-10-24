import { parseRouteId } from './parseRouteId'

describe('parseRouteId', () => {
  it.each([
    ['1', 1],
    ['42', 42],
  ])('parses %s', (value, expected) => {
    expect(parseRouteId(value)).toBe(expected)
  })

  it.each([undefined, '', '0', '-1', '1.5', 'abc', '1e3', '01', ' 1', '12345678901', ['1']])(
    'rejects %p',
    (value) => {
      expect(parseRouteId(value)).toBeNull()
    },
  )
})
