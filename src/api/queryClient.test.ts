import { HttpError, InvalidResponseError, TimeoutError } from './errors'
import {
  createQueryClient,
  createServerQueryClient,
  getRetryDelay,
  prefetchWithinBudget,
  shouldRetry,
} from './queryClient'

describe('shouldRetry', () => {
  it('retries server errors and timeouts up to 3 times', () => {
    expect(shouldRetry(0, new HttpError(503))).toBe(true)
    expect(shouldRetry(2, new TimeoutError())).toBe(true)
    expect(shouldRetry(3, new HttpError(503))).toBe(false)
  })

  it('never retries client errors or invalid payloads', () => {
    expect(shouldRetry(0, new HttpError(404))).toBe(false)
    expect(shouldRetry(0, new InvalidResponseError())).toBe(false)
  })
})

describe('getRetryDelay', () => {
  it('grows exponentially and is capped', () => {
    expect([0, 1, 2, 3, 4].map(getRetryDelay)).toEqual([1000, 2000, 4000, 8000, 8000])
  })
})

describe('query clients', () => {
  it('configures the browser client with retries and no mutation retry', () => {
    const options = createQueryClient().getDefaultOptions()
    expect(options.queries?.retry).toBe(shouldRetry)
    expect(options.mutations?.retry).toBe(false)
  })

  it('never retries on the server', () => {
    expect(createServerQueryClient().getDefaultOptions().queries?.retry).toBe(false)
  })
})

describe('prefetchWithinBudget', () => {
  it('waits for fast prefetches', async () => {
    let done = false
    await prefetchWithinBudget([Promise.resolve().then(() => (done = true))], 1000)
    expect(done).toBe(true)
  })

  it('stops waiting once the budget is spent', async () => {
    const never = new Promise(() => undefined)
    await expect(prefetchWithinBudget([never], 10)).resolves.toBeUndefined()
  })

  it('ignores failed prefetches', async () => {
    await expect(prefetchWithinBudget([Promise.reject(new Error('down'))])).resolves.toBeUndefined()
  })
})
