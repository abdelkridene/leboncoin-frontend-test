import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { renderWithProviders } from '@/test/renderWithProviders'
import { NoConversationSelected } from './NoConversationSelected'

describe('NoConversationSelected', () => {
  it('invites to pick a conversation', () => {
    renderWithProviders(<NoConversationSelected />)
    expect(screen.getByText('Sélectionnez une conversation')).toBeInTheDocument()
  })

  it('reports a conversations failure and recovers on retry', async () => {
    server.use(http.get(apiUrl('/conversations/:userId'), () => new HttpResponse(null, { status: 503 }), { once: true }))
    renderWithProviders(<NoConversationSelected />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger vos conversations.')
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(await screen.findByText('Sélectionnez une conversation')).toBeInTheDocument()
  })
})
