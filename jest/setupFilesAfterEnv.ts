import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
import { server } from '../src/test/server'

expect.extend(toHaveNoViolations)

// jsdom has no IntersectionObserver; next/link otherwise falls back to an idle callback that updates state outside act().
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IntersectionObserverStub })

// jsdom has no matchMedia: default to a desktop viewport, tests can override it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }),
})

// Pages Router hooks need a mounted router; tests assert on navigation through this mock.
jest.mock('next/router', () => {
  const router = { push: jest.fn().mockResolvedValue(true) }
  return { useRouter: () => router }
})

// jsdom does not implement modal dialogs yet.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.open = false
  this.dispatchEvent(new Event('close'))
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})
afterAll(() => server.close())
