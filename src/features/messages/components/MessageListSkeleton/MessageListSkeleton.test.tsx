import { render, screen } from '@testing-library/react'
import { MessageListSkeleton } from './MessageListSkeleton'

describe('MessageListSkeleton', () => {
  it('announces the loading state', () => {
    render(<MessageListSkeleton />)
    expect(screen.getByRole('status')).toHaveTextContent('Chargement des messages…')
  })
})
