const LOCALE = 'fr-FR'
const MS_PER_SECOND = 1000

export const DEFAULT_TIME_ZONE = 'Europe/Paris'

type DateFormat = 'time' | 'dayMonth' | 'fullDate' | 'fullDateTime' | 'calendarDay'

const DATE_FORMATS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  time: { hour: '2-digit', minute: '2-digit' },
  dayMonth: { day: 'numeric', month: 'short' },
  fullDate: { day: '2-digit', month: '2-digit', year: 'numeric' },
  fullDateTime: { dateStyle: 'long', timeStyle: 'short' },
  calendarDay: { day: 'numeric', month: 'numeric', year: 'numeric' },
}

const formatters = new Map<string, Intl.DateTimeFormat>()

const getFormatter = (format: DateFormat, timeZone: string): Intl.DateTimeFormat => {
  const key = `${format}|${timeZone}`
  const cached = formatters.get(key)
  if (cached) return cached
  const formatter = new Intl.DateTimeFormat(LOCALE, { ...DATE_FORMATS[format], timeZone })
  formatters.set(key, formatter)
  return formatter
}

interface CalendarDay {
  year: number
  month: number
  day: number
}

const toCalendarDay = (date: Date, timeZone: string): CalendarDay => {
  const parts = getFormatter('calendarDay', timeZone).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value)
  return { year: read('year'), month: read('month'), day: read('day') }
}

const isSameCalendarDay = (a: CalendarDay, b: CalendarDay) => a.year === b.year && a.month === b.month && a.day === b.day

// Computed on the calendar rather than by subtracting 24 hours, which breaks on daylight saving days.
const previousCalendarDay = ({ year, month, day }: CalendarDay): CalendarDay => {
  const previous = new Date(Date.UTC(year, month - 1, day - 1))
  return { year: previous.getUTCFullYear(), month: previous.getUTCMonth() + 1, day: previous.getUTCDate() }
}

export const toDate = (timestampInSeconds: number): Date => new Date(timestampInSeconds * MS_PER_SECOND)

export const toTimestampInSeconds = (date: Date): number => Math.floor(date.getTime() / MS_PER_SECOND)

export const formatConversationDate = (timestampInSeconds: number, timeZone: string, now: Date = new Date()): string => {
  const date = toDate(timestampInSeconds)
  const day = toCalendarDay(date, timeZone)
  const today = toCalendarDay(now, timeZone)
  if (isSameCalendarDay(day, today)) return getFormatter('time', timeZone).format(date)
  if (isSameCalendarDay(day, previousCalendarDay(today))) return 'Hier'
  if (day.year === today.year) return getFormatter('dayMonth', timeZone).format(date)
  return getFormatter('fullDate', timeZone).format(date)
}

export const formatMessageTime = (timestampInSeconds: number, timeZone: string, now: Date = new Date()): string => {
  const date = toDate(timestampInSeconds)
  const isToday = isSameCalendarDay(toCalendarDay(date, timeZone), toCalendarDay(now, timeZone))
  return getFormatter(isToday ? 'time' : 'fullDateTime', timeZone).format(date)
}

export const toIsoString = (timestampInSeconds: number): string => toDate(timestampInSeconds).toISOString()
