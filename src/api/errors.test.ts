import { HttpError, TimeoutError, isClientError, isNotFoundError } from './errors'

describe('isClientError', () => {
  it.each([400, 404, 499])('is true for status %i', (status) => {
    expect(isClientError(new HttpError(status))).toBe(true)
  })

  it.each([500, 503])('is false for status %i', (status) => {
    expect(isClientError(new HttpError(status))).toBe(false)
  })

  it('is false for non HTTP errors', () => {
    expect(isClientError(new TimeoutError())).toBe(false)
  })
})

describe('isNotFoundError', () => {
  it('only matches 404 HTTP errors', () => {
    expect(isNotFoundError(new HttpError(404))).toBe(true)
    expect(isNotFoundError(new HttpError(400))).toBe(false)
    expect(isNotFoundError(new Error('404'))).toBe(false)
  })
})
