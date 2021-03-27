import React, { ReactElement, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home';
import { AuthProvider } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { ModalProvider } from './contexts/ModalContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/Login';
import Register from './pages/Register';
import Month from './pages/Month';
import ScreeningsProvider from './contexts/ScreeningsContext';
import Day from './pages/Day';
import NotFound from './pages/NotFound';
import LoadingIndicator from './components/LoadingIndicator';
import ContentContainer from './components/ContentContainer';

const Map = React.lazy(() => import('./pages/Map'));

const App = (): ReactElement => (
    <Router>
        <Layout>
            <ErrorBoundary>
                <AuthProvider>
                    <ModalProvider>
                        <Switch>
                            <Route path="/map">
                                <Suspense fallback={<LoadingIndicator />}>
                                    <Map />
                                </Suspense>
                            </Route>

                            <Route>
                                <ContentContainer>
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
                                        <Route path="*">
                                            <NotFound />
                                        </Route>
                                    </Switch>
                                </ContentContainer>
                            </Route>
                        </Switch>
                    </ModalProvider>
                </AuthProvider>
            </ErrorBoundary>
        </Layout>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
