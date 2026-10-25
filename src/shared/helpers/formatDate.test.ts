import {
  DEFAULT_TIME_ZONE,
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
    expect(formatConversationDate(seconds('2021-07-07T14:45:00Z'), 'UTC', now)).toBe('14:45')
  })

  it('shows "Hier" for yesterday', () => {
    expect(formatConversationDate(seconds('2021-07-06T09:00:00Z'), 'UTC', now)).toBe('Hier')
  })

  it('shows day and month earlier in the year', () => {
    expect(formatConversationDate(seconds('2021-05-06T09:00:00Z'), 'UTC', now)).toBe('6 mai')
  })

  it('shows the full date for previous years', () => {
    expect(formatConversationDate(seconds('2020-12-24T09:00:00Z'), 'UTC', now)).toBe('24/12/2020')
  })

  it('decides what "today" means in the given time zone', () => {
    const lateEvening = seconds('2021-07-06T23:30:00Z')
    const morning = new Date('2021-07-07T08:00:00Z')
    expect(formatConversationDate(lateEvening, 'UTC', morning)).toBe('Hier')
    expect(formatConversationDate(lateEvening, 'Europe/Paris', morning)).toBe('01:30')
  })

  it('finds yesterday on the 25 hour day that ends daylight saving time', () => {
    const lastHourOfTheDay = new Date('2021-10-31T22:30:00Z')
    expect(formatConversationDate(seconds('2021-10-30T12:00:00Z'), 'Europe/Paris', lastHourOfTheDay)).toBe('Hier')
  })

  it('defaults to the current date', () => {
    expect(formatConversationDate(toTimestampInSeconds(new Date()), 'UTC')).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('formatMessageTime', () => {
  it('shows only the time for today', () => {
    expect(formatMessageTime(seconds('2021-07-07T08:05:00Z'), 'UTC', now)).toBe('08:05')
  })

  it('shows date and time for older messages', () => {
    expect(formatMessageTime(seconds('2021-05-06T09:30:00Z'), 'UTC', now)).toBe('6 mai 2021 à 09:30')
  })

  it('shows the time of the given time zone, whatever the machine it runs on', () => {
    const message = seconds('2021-07-07T06:04:09Z')
    expect(formatMessageTime(message, DEFAULT_TIME_ZONE, now)).toBe('08:04')
    expect(formatMessageTime(message, 'America/New_York', now)).toBe('02:04')
  })

  it('defaults to the current date', () => {
    expect(formatMessageTime(toTimestampInSeconds(new Date()), 'UTC')).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('toIsoString', () => {
  it('returns a machine readable date for <time dateTime>', () => {
    expect(toIsoString(1625637849)).toBe('2021-07-07T06:04:09.000Z')
  })
})
