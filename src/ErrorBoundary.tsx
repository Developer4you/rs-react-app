import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            color: 'red',
            border: '1px solid red',
            margin: '20px',
            textAlign: 'center',
          }}
        >
          <h2>Something went wrong!</h2>
          <p>
            <strong>Error:</strong> {this.state.error?.toString()}
          </p>
          <p>
            <strong>Component stack:</strong>{' '}
            {this.state.errorInfo?.componentStack}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 16px',
              marginTop: '10px',
              cursor: 'pointer',
            }}
          >
            Try to recover
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
