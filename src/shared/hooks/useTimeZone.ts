import { useSyncExternalStore } from 'react'
import { DEFAULT_TIME_ZONE } from '@/shared/helpers/formatDate'

const subscribe = () => () => undefined

const getBrowserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE

// The server and the hydration render share the default time zone, so their dates match; the browser's own zone follows.
export const useTimeZone = (): string => useSyncExternalStore(subscribe, getBrowserTimeZone, () => DEFAULT_TIME_ZONE)
