import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { axe } from 'jest-axe'
import type { GetServerSidePropsContext } from 'next'
import type { PrefetchedProps } from '@/api/serverPrefetch'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { conversations } from '@/test/fixtures'
import { renderWithProviders } from '@/test/renderWithProviders'
import Home, { getServerSideProps } from '@/pages/index'

const runGetServerSideProps = async () => {
  const result = await getServerSideProps({ req: { headers: {} } } as GetServerSidePropsContext)
  if (!('props' in result)) throw new Error('expected props')
  return (await result.props) as PrefetchedProps
}

describe('Home page', () => {
  it('renders the conversation list and invites to pick a conversation', async () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Sélectionnez une conversation')).toBeInTheDocument()
    expect(await screen.findAllByRole('link', { name: /Jeremie|Patrick|Elodie/ })).toHaveLength(3)
  })

  it('reports a conversations failure in the detail panel only', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderWithProviders(<Home />)

    const detail = screen.getByRole('region', { name: 'Conversation' })
    expect(await within(detail).findByRole('alert')).toHaveTextContent('Impossible de charger vos conversations.')
    expect(within(screen.getByRole('navigation', { name: 'Conversations' })).queryByRole('alert')).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<Home />)
    await screen.findAllByRole('link', { name: /Jeremie/ })
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Home getServerSideProps', () => {
  it('prefetches the conversations', async () => {
    const { dehydratedState } = await runGetServerSideProps()
    expect(dehydratedState?.queries[0].state.data).toEqual(conversations)
  })

  it('still renders the page when the API is down', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 })))
    const { dehydratedState } = await runGetServerSideProps()
    expect(dehydratedState?.queries).toHaveLength(0)
  })
})
