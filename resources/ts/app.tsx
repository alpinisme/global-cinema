import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import { AuthProvider } from './utils/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { ModalProvider } from './contexts/ModalContext';

const App = (): ReactElement => (
    <ErrorBoundary>
        <AuthProvider>
            <ModalProvider>
                <Layout>
                    <Home />
                </Layout>
            </ModalProvider>
        </AuthProvider>
    </ErrorBoundary>
);

ReactDOM.render(<App />, document.getElementById('root'));
