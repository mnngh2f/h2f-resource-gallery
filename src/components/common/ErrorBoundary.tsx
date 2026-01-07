// ErrorBoundary Component - Error handling wrapper

import { Component } from 'preact';
import type { ComponentChildren } from 'preact';

interface ErrorBoundaryProps {
  children: ComponentChildren;
  fallback?: ComponentChildren;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#FF2153',
              marginBottom: '8px',
            }}
          >
            Something went wrong
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#666',
              marginBottom: '16px',
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#f5f5f5',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
