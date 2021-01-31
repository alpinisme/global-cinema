import React, { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // By setting state, we trigger a re-render and thus display the error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        // Consider logging error messages to server here
    }

    render(): ReactNode {
        if (this.state.errorInfo) {
            // There has been an error
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.toString()}</p>
                </div>
            );
        }
        // There has been no error, carry on with business as usual
        return this.props.children;
    }
}

export default ErrorBoundary;

interface ErrorProps {
    children: ReactNode;
}

interface ErrorState {
    error: Error | null;
    errorInfo: ErrorInfo | null;
}
