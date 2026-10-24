import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { axe } from 'jest-axe'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { renderWithProviders } from '@/test/renderWithProviders'
import { mockMobileViewport } from '@/test/mockViewport'
import { ConversationPanel } from './ConversationPanel'

const failOnce = (path: string) =>
  server.use(http.get(apiUrl(path), () => new HttpResponse(null, { status: 503 }), { once: true }))

describe('ConversationPanel', () => {
  it('shows the interlocutor and the messages', async () => {
    renderWithProviders(<ConversationPanel conversationId={1} />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement')

    expect(await screen.findByRole('heading', { name: 'Jeremie' })).toBeInTheDocument()
    expect(await screen.findByRole('log')).toHaveTextContent('Bonjour, il est toujours disponible ?')
  })

  it('moves the focus to the conversation heading on mobile only', async () => {
    const { unmount } = renderWithProviders(<ConversationPanel conversationId={1} />)
    expect(await screen.findByRole('heading', { name: 'Jeremie' })).not.toHaveFocus()
    unmount()

    const restore = mockMobileViewport()
    renderWithProviders(<ConversationPanel conversationId={1} />)
    expect(await screen.findByRole('heading', { name: 'Jeremie' })).toHaveFocus()
    restore()
  })

  it('shows an empty state for a conversation without messages', async () => {
    renderWithProviders(<ConversationPanel conversationId={3} />)
    expect(await screen.findByText('Aucun message')).toBeInTheDocument()
    expect(screen.getByText('Envoyez le premier message à Elodie.')).toBeInTheDocument()
  })

  it('shows a dedicated state for an unknown conversation', async () => {
    renderWithProviders(<ConversationPanel conversationId={999} />)
    expect(await screen.findByText('Conversation introuvable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour aux conversations' })).toHaveAttribute('href', '/')
  })

  it('recovers from a conversations failure', async () => {
    failOnce('/conversations/:userId')
    renderWithProviders(<ConversationPanel conversationId={1} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger la conversation.')

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(await screen.findByRole('heading', { name: 'Jeremie' })).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<ConversationPanel conversationId={1} />)
    await screen.findByRole('log')
    expect(await axe(container)).toHaveNoViolations()
  })
})
