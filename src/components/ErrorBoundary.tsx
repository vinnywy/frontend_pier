/**
 * ErrorBoundary — captura erros de runtime na árvore filha e mostra uma
 * mensagem amigável em vez de derrubar a página inteira (tela branca).
 */
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border-l-4 border-red-500 bg-surface p-4 text-sm text-red-500">
            Não foi possível exibir este conteúdo.
          </div>
        )
      )
    }
    return this.props.children
  }
}
