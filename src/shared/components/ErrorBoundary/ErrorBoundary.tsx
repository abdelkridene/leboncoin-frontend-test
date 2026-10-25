import { Component, type ReactNode } from 'react'
import { ErrorState } from '../ErrorState/ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  private reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) return <ErrorState onRetry={this.reset} />
    return this.props.children
  }
}
