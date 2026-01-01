import { Component, ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  fallback?: ComponentChildren;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="h-screen flex items-center justify-center bg-bg">
          <div className="bg-surface border border-border rounded-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-text mb-2">
              Something went wrong
            </h1>
            <p className="text-textMuted mb-6">
              The application encountered an unexpected error. Error details have been logged to console.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-bg px-6 py-2 rounded font-medium hover:bg-primaryHover transition-colors"
            >
              Reload Page
            </button>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="block mt-4 text-sm text-textMuted hover:text-text transition-colors"
            >
              Try to recover
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
