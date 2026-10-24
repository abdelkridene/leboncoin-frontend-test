export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'HttpError'
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timed out')
    this.name = 'TimeoutError'
  }
}

export class InvalidResponseError extends Error {
  constructor() {
    super('Unexpected response from server')
    this.name = 'InvalidResponseError'
  }
}

export const isClientError = (error: unknown): boolean =>
  error instanceof HttpError && error.status >= 400 && error.status < 500

export const isNotFoundError = (error: unknown): boolean =>
  error instanceof HttpError && error.status === 404
