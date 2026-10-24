import { render, screen } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { Router } from 'next/router'
import App from '@/pages/_app'

const DummyPage = () => {
  const queryClient = useQueryClient()
  return <p>{queryClient.getQueryData<string>(['greeting'])}</p>
}

describe('App', () => {
  it('provides a query client hydrated with the server state', () => {
    const dehydratedState = {
      mutations: [],
      queries: [{ queryKey: ['greeting'], queryHash: '["greeting"]', state: { data: 'bonjour', dataUpdatedAt: Date.now(), status: 'success' } }],
    }
    const props = { Component: DummyPage, pageProps: { dehydratedState }, router: {} as Router } as unknown as AppProps
    render(<App {...props} />)
    expect(screen.getByText('bonjour')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Messages' })).toBeInTheDocument()
  })
})
