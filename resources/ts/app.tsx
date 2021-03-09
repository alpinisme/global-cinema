import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import { AuthProvider } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { ModalProvider } from './contexts/ModalContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/Login';
import Register from './pages/Register';

const App = (): ReactElement => (
    <ErrorBoundary>
        <AuthProvider>
            <ModalProvider>
                <Router>
                    <Layout>
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route path="/login">
                                <LoginPage />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                        </Switch>
                    </Layout>
                </Router>
            </ModalProvider>
        </AuthProvider>
    </ErrorBoundary>
);

ReactDOM.render(<App />, document.getElementById('root'));
