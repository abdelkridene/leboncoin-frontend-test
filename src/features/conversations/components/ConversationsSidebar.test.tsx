import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { axe } from 'jest-axe'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { renderWithProviders } from '@/test/renderWithProviders'
import { mockMobileViewport } from '@/test/mockViewport'
import { useRememberViewedConversation } from '../hooks/useConversationFocusRestoration'
import { ConversationsSidebar } from './ConversationsSidebar'

describe('ConversationsSidebar', () => {
  it('shows a skeleton then the conversations, most recent first', async () => {
    renderWithProviders(<ConversationsSidebar selectedConversationId={1} />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement')

    const links = await screen.findAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      expect.stringContaining('Elodie'),
      expect.stringContaining('Jeremie'),
      expect.stringContaining('Patrick'),
    ])
    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('Jeremie')
  })

  it('shows an empty state when there is no conversation', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => HttpResponse.json([])))
    renderWithProviders(<ConversationsSidebar selectedConversationId={null} />)
    expect(await screen.findByText('Aucune conversation')).toBeInTheDocument()
  })

  it('shows a friendly error and recovers on retry', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderWithProviders(<ConversationsSidebar selectedConversationId={null} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger vos conversations.')
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(await screen.findAllByRole('link')).toHaveLength(3)
  })

  it('gives the focus back to the conversation the user returns from on mobile', async () => {
    const ViewedConversation = () => {
      useRememberViewedConversation(2)
      return null
    }
    renderWithProviders(<ViewedConversation />).unmount()
    const restore = mockMobileViewport()

    renderWithProviders(<ConversationsSidebar selectedConversationId={null} />)
    expect(await screen.findByRole('link', { name: /Patrick/ })).toHaveFocus()
    restore()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<ConversationsSidebar selectedConversationId={null} />)
    await screen.findAllByRole('link')
    expect(await axe(container)).toHaveNoViolations()
  })
})
