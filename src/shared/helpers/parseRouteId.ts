const POSITIVE_INTEGER = /^[1-9]\d{0,9}$/

export const parseRouteId = (value: string | string[] | undefined): number | null =>
  typeof value === 'string' && POSITIVE_INTEGER.test(value) ? Number(value) : null
