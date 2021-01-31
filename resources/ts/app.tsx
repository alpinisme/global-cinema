import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import { AuthProvider } from './utils/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

const App = (): ReactElement => (
    <ErrorBoundary>
        <AuthProvider>
            <Layout>
                <Home />
            </Layout>
        </AuthProvider>
    </ErrorBoundary>
);

ReactDOM.render(<App />, document.getElementById('root'));
