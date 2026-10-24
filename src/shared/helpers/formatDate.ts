const LOCALE = 'fr-FR'
const MS_PER_SECOND = 1000

const timeFormatter = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' })
const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' })
const fullDateFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' })
const fullDateTimeFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeStyle: 'short' })

export const toDate = (timestampInSeconds: number): Date => new Date(timestampInSeconds * MS_PER_SECOND)

export const toTimestampInSeconds = (date: Date): number => Math.floor(date.getTime() / MS_PER_SECOND)

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isYesterday = (date: Date, now: Date) => {
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return isSameDay(date, yesterday)
}

export const formatConversationDate = (timestampInSeconds: number, now: Date = new Date()): string => {
  const date = toDate(timestampInSeconds)
  if (isSameDay(date, now)) return timeFormatter.format(date)
  if (isYesterday(date, now)) return 'Hier'
  if (date.getFullYear() === now.getFullYear()) return dayMonthFormatter.format(date)
  return fullDateFormatter.format(date)
}

export const formatMessageTime = (timestampInSeconds: number, now: Date = new Date()): string => {
  const date = toDate(timestampInSeconds)
  if (isSameDay(date, now)) return timeFormatter.format(date)
  return fullDateTimeFormatter.format(date)
}

export const toIsoString = (timestampInSeconds: number): string => toDate(timestampInSeconds).toISOString()
