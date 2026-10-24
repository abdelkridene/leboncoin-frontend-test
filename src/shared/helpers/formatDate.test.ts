import {
  formatConversationDate,
  formatMessageTime,
  toDate,
  toIsoString,
  toTimestampInSeconds,
} from './formatDate'

const now = new Date('2021-07-07T18:00:00Z')
const seconds = (iso: string) => toTimestampInSeconds(new Date(iso))

describe('toDate / toTimestampInSeconds', () => {
  it('converts between seconds and dates', () => {
    expect(toDate(1625637849).toISOString()).toBe('2021-07-07T06:04:09.000Z')
    expect(toTimestampInSeconds(new Date('2021-07-07T06:04:09.900Z'))).toBe(1625637849)
  })
})

describe('formatConversationDate', () => {
  it('shows the time for today', () => {
    expect(formatConversationDate(seconds('2021-07-07T14:45:00Z'), now)).toBe('14:45')
  })

  it('shows "Hier" for yesterday', () => {
    expect(formatConversationDate(seconds('2021-07-06T09:00:00Z'), now)).toBe('Hier')
  })

  it('shows day and month earlier in the year', () => {
    expect(formatConversationDate(seconds('2021-05-06T09:00:00Z'), now)).toBe('6 mai')
  })

  it('shows the full date for previous years', () => {
    expect(formatConversationDate(seconds('2020-12-24T09:00:00Z'), now)).toBe('24/12/2020')
  })

  it('defaults to the current date', () => {
    expect(formatConversationDate(toTimestampInSeconds(new Date()))).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('formatMessageTime', () => {
  it('shows only the time for today', () => {
    expect(formatMessageTime(seconds('2021-07-07T08:05:00Z'), now)).toBe('08:05')
  })

  it('shows date and time for older messages', () => {
    expect(formatMessageTime(seconds('2021-05-06T09:30:00Z'), now)).toBe('6 mai 2021 à 09:30')
  })

  it('defaults to the current date', () => {
    expect(formatMessageTime(toTimestampInSeconds(new Date()))).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('toIsoString', () => {
  it('returns a machine readable date for <time dateTime>', () => {
    expect(toIsoString(1625637849)).toBe('2021-07-07T06:04:09.000Z')
  })
})
