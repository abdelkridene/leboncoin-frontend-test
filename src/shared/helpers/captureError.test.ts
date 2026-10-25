import { captureError } from './captureError'

const replaceReportError = (value: typeof globalThis.reportError | undefined) =>
  Object.defineProperty(globalThis, 'reportError', { value, configurable: true, writable: true })

describe('captureError', () => {
  const originalReportError = globalThis.reportError

  afterEach(() => replaceReportError(originalReportError))

  it('hands the error to the browser error reporting', () => {
    const reportError = jest.fn()
    replaceReportError(reportError)
    const error = new Error('boom')

    captureError(error)

    expect(reportError).toHaveBeenCalledWith(error)
  })

  it('does nothing where the browser cannot report errors', () => {
    replaceReportError(undefined)
    expect(() => captureError(new Error('boom'))).not.toThrow()
  })
})
