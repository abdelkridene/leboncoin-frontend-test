import { render, screen } from '@testing-library/react'
import type { AppProps } from 'next/app'
import type { Router } from 'next/router'
import App from '@/pages/_app'

const DummyPage = () => <p>dummy page</p>

describe('App', () => {
  it('renders the current page', () => {
    const props = { Component: DummyPage, pageProps: {}, router: {} as Router } as AppProps
    render(<App {...props} />)
    expect(screen.getByText('dummy page')).toBeInTheDocument()
  })
})
