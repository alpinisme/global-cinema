import React, { useState, useEffect, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';
import AdminPage from './components/AdminPage';
import axios from 'axios';
import { addOnce } from './modules/functions';

const App = (): ReactElement => {
    const [errors, setErrors] = useState<string[]>([]);
    const [userType, setUserType] = useState<string | null>(null);

    /**
     * get user type from api
     */
    useEffect(() => {
        axios
            .get('/role')
            .then(res => res.data)
            .then(setUserType)
            .catch(console.log);
    }, []);

    /**
     * display errors if any
     */
    if (errors.length > 0) {
        return <ErrorBox errors={errors} />;
    }

    /**
     * show appropriate page
     */
    switch (userType) {
        case null:
            return <div>...loading</div>;

        case 'user':
            return <StudentPage setErrors={d => setErrors(addOnce(d))} />;

        case 'instructor':
            return <InstructorPage setErrors={d => setErrors(addOnce(d))} />;

        case 'admin':
            return <AdminPage setErrors={d => setErrors(addOnce(d))} />;

        default:
            setErrors(addOnce("couldn't recognize user role"));
            return <></>;
    }
};

export default App;

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
