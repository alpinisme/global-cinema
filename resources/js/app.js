import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import StudentPage from './components/StudentPage';
import InstructorPage from './components/InstructorPage';
import axios from 'axios';

const Root = () => {
    const [errors, setErrors] = useState([]);
    const [userType, setUserType] = useState(null);

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

    if (errors.lenth > 0) {
        return <ErrorBox errors={errors} />;
    }

    switch (userType) {
        case null:
            return <div>...loading</div>;

        case 'user':
            return <StudentPage setErrors={setErrors} />;

        case 'instructor':
            return <InstructorPage setErrors={setErrors} />;
        default:
            setErrors(errs => errs.push("couldn't recognize user role"));
    }
};

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);
