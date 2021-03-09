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
import Month from './components/Month';
import ScreeningsProvider from './contexts/ScreeningsContext';
import Day from './components/Day';
import { CityContextProvider } from './contexts/CityContext';

const App = (): ReactElement => (
    <ErrorBoundary>
        <AuthProvider>
            <ModalProvider>
                <Router>
                    <Layout>
                        <CityContextProvider>
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
                                <Route exact path="/screening-entry/:month">
                                    <ScreeningsProvider>
                                        <Month />
                                    </ScreeningsProvider>
                                </Route>
                                <Route path="/screening-entry/:month/:day">
                                    <ScreeningsProvider>
                                        <Day />
                                    </ScreeningsProvider>
                                </Route>
                            </Switch>
                        </CityContextProvider>
                    </Layout>
                </Router>
            </ModalProvider>
        </AuthProvider>
    </ErrorBoundary>
);

ReactDOM.render(<App />, document.getElementById('root'));
