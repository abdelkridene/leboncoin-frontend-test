import type { ZodType } from 'zod'
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config'
import { HttpError, InvalidResponseError, TimeoutError } from './errors'

type HttpMethod = 'GET' | 'POST'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
  timeoutMs?: number
}

const withTimeout = (timeoutMs: number, signal?: AbortSignal) => {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const abortFromCaller = () => controller.abort(signal?.reason)

  signal?.addEventListener('abort', abortFromCaller, { once: true })

  return {
    signal: controller.signal,
    hasTimedOut: () => timedOut,
    cleanup: () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abortFromCaller)
    },
  }
}

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    throw new InvalidResponseError()
  }
}

export const request = async <T>(
  path: string,
  schema: ZodType<T>,
  { method = 'GET', body, signal, timeoutMs = REQUEST_TIMEOUT_MS }: RequestOptions = {},
): Promise<T> => {
  signal?.throwIfAborted()
  const timeout = withTimeout(timeoutMs, signal)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: timeout.signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!response.ok) throw new HttpError(response.status)

    const parsed = schema.safeParse(await parseJson(response))
    if (!parsed.success) throw new InvalidResponseError()
    return parsed.data
  } catch (error) {
    if (timeout.hasTimedOut()) throw new TimeoutError()
    throw error
  } finally {
    timeout.cleanup()
  }
}
