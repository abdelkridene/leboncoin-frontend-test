import type { ReactElement, ReactNode } from 'react'
import { render, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

export const renderWithProviders = (ui: ReactElement, queryClient = createTestQueryClient()) => ({
  queryClient,
  ...render(ui, { wrapper: createWrapper(queryClient) }),
})

export const renderHookWithProviders = <Result,>(hook: () => Result, queryClient = createTestQueryClient()) => ({
  queryClient,
  ...renderHook(hook, { wrapper: createWrapper(queryClient) }),
})
