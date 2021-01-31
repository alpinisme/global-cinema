import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import '@testing-library/jest-dom/extend-expect';

describe('ErrorBoundary', () => {
    it('should show the error but not fail if a child component throws an error', () => {
        const errMsg = 'Oops. I failed.';
        const msg = 'What I wish I could render';

        function Thrower() {
            throw new Error(errMsg);
            return <div>msg</div>;
        }
        render(
            <ErrorBoundary>
                <Thrower />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText('Error: ' + errMsg)).toBeInTheDocument();
        expect(screen.queryByText(msg)).not.toBeInTheDocument();
    });
});
