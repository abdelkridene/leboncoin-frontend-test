import { toIsoString } from '@/shared/helpers/formatDate'
import { useTimeZone } from '@/shared/hooks/useTimeZone'

interface TimestampProps {
  value: number
  format: (timestampInSeconds: number, timeZone: string) => string
  className?: string
}

export const Timestamp = ({ value, format, className }: TimestampProps) => {
  const timeZone = useTimeZone()

  return (
    <time className={className} dateTime={toIsoString(value)}>
      {format(value, timeZone)}
    </time>
  )
}
