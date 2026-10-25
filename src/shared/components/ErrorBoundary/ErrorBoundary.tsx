import { Component, type ReactNode } from 'react'
import { captureError } from '@/shared/helpers/captureError'
import { ErrorState } from '../ErrorState/ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  resetKey?: unknown
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    captureError(error)
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) this.reset()
  }

  private reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) return <ErrorState onRetry={this.reset} />
    return this.props.children
  }
}
