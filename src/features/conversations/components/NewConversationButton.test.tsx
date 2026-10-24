import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useRouter } from 'next/router'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { users } from '@/test/fixtures'
import { renderWithProviders } from '@/test/renderWithProviders'
import { NewConversationButton } from './NewConversationButton'

const extraUser = { id: 5, nickname: 'Amélie' }

const openDialog = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Nouvelle conversation' }))
  return screen.findByRole('dialog', { name: 'Nouvelle conversation' })
}

describe('NewConversationButton', () => {
  beforeEach(() => server.use(http.get(apiUrl('/users'), () => HttpResponse.json([...users, extraUser]))))

  it('opens the existing conversation instead of creating a duplicate', async () => {
    renderWithProviders(<NewConversationButton />)
    const dialog = await openDialog()

    await userEvent.click(await within(dialog).findByRole('button', { name: /Jeremie/ }))
    expect(useRouter().push).toHaveBeenCalledWith('/conversations/1')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('creates a conversation with a new contact and opens it', async () => {
    server.use(http.post(apiUrl('/conversations/1'), () => HttpResponse.json({ id: 77 })))
    renderWithProviders(<NewConversationButton />)
    const dialog = await openDialog()

    await userEvent.click(await within(dialog).findByRole('button', { name: 'Amélie' }))

    await waitFor(() => expect(useRouter().push).toHaveBeenCalledWith('/conversations/77'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the dialog open with an error when the creation fails', async () => {
    server.use(http.post(apiUrl('/conversations/1'), () => new HttpResponse(null, { status: 503 })))
    renderWithProviders(<NewConversationButton />)
    const dialog = await openDialog()

    await userEvent.click(await within(dialog).findByRole('button', { name: 'Amélie' }))
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('La conversation n’a pas pu être créée.')
    expect(useRouter().push).not.toHaveBeenCalled()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Fermer' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an error when users cannot be loaded and retries', async () => {
    server.use(http.get(apiUrl('/users'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderWithProviders(<NewConversationButton />)
    const dialog = await openDialog()

    expect(await within(dialog).findByText('Impossible de charger les contacts.')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Réessayer' }))
    expect(await within(dialog).findByRole('button', { name: 'Amélie' })).toBeInTheDocument()
  })
})
