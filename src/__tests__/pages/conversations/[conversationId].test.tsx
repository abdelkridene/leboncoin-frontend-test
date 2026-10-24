import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import type { GetServerSidePropsContext } from 'next'
import { renderWithProviders } from '@/test/renderWithProviders'
import ConversationPage, { getServerSideProps } from '@/pages/conversations/[conversationId]'

const contextFor = (conversationId: string) =>
  ({ params: { conversationId }, req: { headers: {} } }) as unknown as GetServerSidePropsContext

describe('Conversation page', () => {
  it('renders the list with the selected conversation and its messages', async () => {
    renderWithProviders(<ConversationPage conversationId={1} dehydratedState={null} />)
    expect(await screen.findByRole('heading', { level: 2, name: 'Jeremie' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { current: 'page' })).toHaveTextContent('Jeremie')
    expect(await screen.findByRole('log')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<ConversationPage conversationId={1} dehydratedState={null} />)
    await screen.findByRole('log')
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Conversation getServerSideProps', () => {
  it.each(['abc', '0', '-3', '1.5'])('returns a 404 for the invalid id %s', async (conversationId) => {
    await expect(getServerSideProps(contextFor(conversationId))).resolves.toEqual({ notFound: true })
  })

  it('prefetches the conversations and the messages', async () => {
    const result = await getServerSideProps(contextFor('1'))
    if (!('props' in result)) throw new Error('expected props')
    const props = await result.props
    expect(props.conversationId).toBe(1)
    expect(props.dehydratedState?.queries.map(({ queryKey }) => queryKey)).toEqual([
      ['conversations', 1],
      ['messages', 1],
    ])
  })
})
