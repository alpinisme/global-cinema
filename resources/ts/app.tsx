import React, { useState, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import InstructorPage from './pages/Instructor';
import AdminPage from './pages/Admin';
import { addOnce } from './utils/functions';
import Student from './pages/Student';
import { useGetRequest } from './utils/hooks';
import { CityContextProvider } from './contexts/CityContext';
import LoginPage from './pages/Login';
import { useAuth, AuthProvider } from './utils/useAuth';

const Wrapper = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

const App = (): ReactElement => {
    const [errors, setErrors] = useState<string[]>([]);
    const auth = useAuth();

    function useGetOrFail<A>(a: string, fn: (s: string) => string) {
        return useGetRequest<A>(a, b => setErrors(addOnce(fn(b))));
    }

    // display login form if not already logged in
    if (!auth.user) {
        return <LoginPage />;
    }

    // display errors if any
    if (errors.length > 0) {
        return <ErrorBox errors={errors} />;
    }

    // show appropriate page
    switch (auth.user.role) {
        case 'user':
            return (
                <CityContextProvider>
                    <Student useGetRequest={useGetOrFail} />
                </CityContextProvider>
            );

        case 'instructor':
            return <InstructorPage useGetRequest={useGetOrFail} />;

        case 'admin':
            return (
                <CityContextProvider>
                    <AdminPage useGetRequest={useGetOrFail} />
                </CityContextProvider>
            );

        case 'unconfirmed_instructor':
            return (
                <div>
                    Please wait for an admin to verify your role before using the site. You may want
                    to email an admin personally to speed up the process.
                </div>
            );

        case 'unconfirmed_contributor':
            return (
                <div>
                    Please wait for an admin to verify your role before using the site. You may want
                    to email an admin personally to speed up the process.
                </div>
            );

        case undefined:
            return (
                <div>
                    There was a problem locating your user status. Try refreshing the page, and if
                    the problem persists, contact a site administrator
                </div>
            );

        default:
            setErrors(addOnce("couldn't recognize user role"));
            return <></>;
    }
};

export default App;

const root = document.getElementById('root');

ReactDOM.render(<Wrapper />, root);
