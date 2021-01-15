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

const App = (): ReactElement => {
    const [errors, setErrors] = useState<string[]>([]);
    const [role, setRole] = useState<string | null>(
        (document.getElementById('role') as HTMLInputElement)?.value
    );

    function useGetOrFail<A>(a: string, fn: (s: string) => string) {
        return useGetRequest<A>(a, b => setErrors(addOnce(fn(b))));
    }

    /**
     * display errors if any
     */
    if (!role) {
        return <LoginPage handleSuccess={setRole} />;
    }

    /**
     * display errors if any
     */
    if (errors.length > 0) {
        return <ErrorBox errors={errors} />;
    }

    /**
     * show appropriate page
     */
    switch (role) {
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

ReactDOM.render(<App />, root);
