import { render, screen } from '@testing-library/react'
import { ConversationListSkeleton } from './ConversationListSkeleton'

describe('ConversationListSkeleton', () => {
  it('announces the loading state to assistive technologies', () => {
    render(<ConversationListSkeleton />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement des conversations…')
  })
})
