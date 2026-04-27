import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unknown frontend error',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PeerCollab render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-shell">
          <div className="surface-card p-5" style={{ maxWidth: '880px', width: '100%' }}>
            <div className="soft-label mb-2">Frontend Error</div>
            <h1 className="page-title mb-3">PeerCollab hit a render problem</h1>
            <p className="text-secondary mb-3">
              The app was crashing before it could render. The message below should help us identify the exact issue.
            </p>
            <div className="alert alert-danger mb-3" role="alert">
              <strong>Error:</strong> {this.state.errorMessage}
            </div>
            <div className="small text-secondary">
              Open the browser console with <code>F12</code> and share the red error if you want me to fix it fully.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
