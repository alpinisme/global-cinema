import React, { ReactElement, useState } from 'react';
import ErrorBox from '../components/ErrorBox';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './Login';
import InstructorPage from './Instructor';
import AdminPage from './Admin';
import Student from './Student';
import { CityContextProvider } from '../contexts/CityContext';

const Home = (): ReactElement => {
    const [errors, setErrors] = useState<string>('');
    const auth = useAuth();

    if (auth.isLoading) {
        return <div>...loading</div>;
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
        case 'student':
            return (
                <CityContextProvider>
                    <Student />
                </CityContextProvider>
            );

        case 'instructor':
            return <InstructorPage />;

        case 'admin':
            return (
                <CityContextProvider>
                    <AdminPage />
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
            setErrors("couldn't recognize user role");
            return <></>;
    }
};

export default Home;
