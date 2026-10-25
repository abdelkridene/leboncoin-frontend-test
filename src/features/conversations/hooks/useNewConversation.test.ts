import { act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useRouter } from 'next/router'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { users } from '@/test/fixtures'
import { renderHookWithProviders } from '@/test/renderWithProviders'
import type { RecipientOption } from '../helpers/getRecipientOptions'
import { useNewConversation } from './useNewConversation'

const amelie = { id: 5, nickname: 'Amélie' }

const findRecipient = (recipients: RecipientOption[], nickname: string) => {
  const recipient = recipients.find(({ user }) => user.nickname === nickname)
  if (!recipient) throw new Error(`${nickname} is not offered as a recipient`)
  return recipient
}

const openDialog = async () => {
  const hook = renderHookWithProviders(() => useNewConversation())
  act(() => hook.result.current.open())
  await waitFor(() => expect(hook.result.current.recipientsStatus).toBe('ready'))
  return hook
}

describe('useNewConversation', () => {
  beforeEach(() => server.use(http.get(apiUrl('/users'), () => HttpResponse.json([...users, amelie]))))

  it('loads the contacts only once the dialog opens', async () => {
    const { result } = renderHookWithProviders(() => useNewConversation())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.recipients).toEqual([])

    act(() => result.current.open())
    await waitFor(() => expect(result.current.recipients.map(({ user }) => user.nickname)).toContain('Amélie'))
  })

  it('opens the existing conversation with a known contact instead of creating a duplicate', async () => {
    const { result } = await openDialog()
    act(() => result.current.selectRecipient(findRecipient(result.current.recipients, 'Jeremie')))
    expect(useRouter().push).toHaveBeenCalledWith('/conversations/1')
    expect(result.current.isOpen).toBe(false)
  })

  it('creates a conversation with a new contact, then closes the dialog', async () => {
    const { result } = await openDialog()
    act(() => result.current.selectRecipient(findRecipient(result.current.recipients, amelie.nickname)))
    await waitFor(() => expect(result.current.isOpen).toBe(false))
    expect(useRouter().push).toHaveBeenCalledWith(expect.stringMatching(/^\/conversations\/\d+$/))
  })

  it('reports contacts it cannot load', async () => {
    server.use(http.get(apiUrl('/users'), () => new HttpResponse(null, { status: 503 })))
    const { result } = renderHookWithProviders(() => useNewConversation())
    act(() => result.current.open())
    await waitFor(() => expect(result.current.recipientsStatus).toBe('error'))
  })
})
