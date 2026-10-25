import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { axe } from 'jest-axe'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { createTestQueryClient, renderWithProviders } from '@/test/renderWithProviders'
import { messages } from '@/test/fixtures'
import { queryKeys } from '@/api/queryKeys'
import { ConversationThread } from './ConversationThread'

const renderThread = (conversationId = 1) =>
  renderWithProviders(<ConversationThread conversationId={conversationId} loggedUserId={1} interlocutorName="Jeremie" />)

const field = () => screen.getByRole('textbox', { name: 'Message à Jeremie' })

describe('ConversationThread', () => {
  it('sends a message, clears the field and keeps the focus in it', async () => {
    renderThread()
    await screen.findByRole('log')

    await userEvent.type(field(), '  Je suis intéressé  ')
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer' }))

    expect(await screen.findByText('Je suis intéressé')).toBeInTheDocument()
    expect(field()).toHaveValue('')
    expect(field()).toHaveFocus()
    await waitFor(() => expect(screen.queryByText('Envoi…')).not.toBeInTheDocument())
  })

  it('sends with Enter and inserts a new line with Shift+Enter', async () => {
    renderThread()
    await screen.findByRole('log')

    await userEvent.type(field(), 'Ligne 1{Shift>}{Enter}{/Shift}Ligne 2')
    expect(field()).toHaveValue('Ligne 1\nLigne 2')

    await userEvent.type(field(), '{Enter}')
    expect(field()).toHaveValue('')
    expect(await screen.findByText(/Ligne 1\s+Ligne 2/)).toBeInTheDocument()
  })

  it('blocks blank messages and concurrent submissions', async () => {
    let postCount = 0
    server.use(
      http.post(apiUrl('/messages/1'), () => {
        postCount += 1
        return new Promise<Response>(() => undefined)
      }),
    )
    renderThread()
    await screen.findByRole('log')
    const send = screen.getByRole('button', { name: 'Envoyer' })

    await userEvent.type(field(), '   ')
    expect(send).toBeDisabled()

    await userEvent.type(field(), 'Premier{Enter}')
    await userEvent.type(field(), 'Second{Enter}')
    expect(send).toBeDisabled()
    expect(field()).toHaveValue('Second')
    expect(postCount).toBe(1)
  })

  it('keeps a failed message visible and lets the user retry it', async () => {
    server.use(http.post(apiUrl('/messages/1'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderThread()
    await screen.findByRole('log')

    await userEvent.type(field(), 'Dernier prix ?{Enter}')
    expect(await screen.findByText(/Échec de l’envoi/)).toBeInTheDocument()
    expect(screen.getByText('Dernier prix ?')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    await waitFor(() => expect(screen.queryByText(/Échec de l’envoi/)).not.toBeInTheDocument())
    expect(screen.getByText('Dernier prix ?')).toBeInTheDocument()
  })

  it('lets the user send the first message of an empty conversation', async () => {
    renderThread(3)
    expect(await screen.findByText('Aucun message')).toBeInTheDocument()

    await userEvent.type(field(), 'Bonjour !{Enter}')
    expect(await screen.findByRole('log')).toHaveTextContent('Bonjour !')
  })

  it('shows an error when messages cannot be loaded and recovers', async () => {
    server.use(http.get(apiUrl('/messages/:conversationId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderThread()
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger les messages.')

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(await screen.findByRole('log')).toBeInTheDocument()
  })

  it('keeps the draft but blocks sending while the history is unavailable', async () => {
    let postCount = 0
    server.use(
      http.get(apiUrl('/messages/:conversationId'), () => new HttpResponse(null, { status: 503 }), { once: true }),
      http.post(apiUrl('/messages/1'), () => {
        postCount += 1
        return HttpResponse.json({ id: 90 })
      }),
    )
    renderThread()
    await screen.findByRole('alert')

    await userEvent.type(field(), 'Toujours dispo ?{Enter}')
    expect(field()).toHaveValue('Toujours dispo ?')
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeDisabled()
    expect(postCount).toBe(0)

    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    await screen.findByRole('log')
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeEnabled()
  })

  it('keeps showing cached messages when a refresh fails', async () => {
    server.use(http.get(apiUrl('/messages/:conversationId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(queryKeys.messages(1), messages)
    renderWithProviders(
      <ConversationThread conversationId={1} loggedUserId={1} interlocutorName="Jeremie" />,
      queryClient,
    )

    expect(await screen.findByText(/Connexion instable/)).toBeInTheDocument()
    expect(screen.getByRole('log')).toHaveTextContent('Oui, toujours !')

    await userEvent.click(screen.getByRole('button', { name: 'Actualiser' }))
    await waitFor(() => expect(screen.queryByText(/Connexion instable/)).not.toBeInTheDocument())
  })

  it('has no accessibility violations', async () => {
    const { container } = renderThread()
    await screen.findByRole('log')
    expect(await axe(container)).toHaveNoViolations()
  })
})
