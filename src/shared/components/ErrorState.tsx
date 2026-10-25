import type { ReactNode } from 'react'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

interface ErrorStateProps {
  title?: string
  description?: string
  illustration?: ReactNode
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Oups, c’est nous, pas vous',
  description = 'Nos serveurs font une petite pause. Réessayez dans quelques instants.',
  illustration,
  onRetry,
}: ErrorStateProps) => (
  <EmptyState role="alert" title={title} description={description} illustration={illustration}>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </EmptyState>
)
