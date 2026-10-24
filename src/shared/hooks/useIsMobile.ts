import { useMediaQuery } from './useMediaQuery'

// Mirrors the 768px breakpoint of the CSS. Queried as max-width so the server snapshot (false) means desktop.
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'

export const useIsMobile = (): boolean => useMediaQuery(MOBILE_MEDIA_QUERY)
