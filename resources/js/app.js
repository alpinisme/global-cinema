import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import StudentPage from './components/StudentPage';

const Root = () => {
    const [errors, setErrors] = useState([]);

    return errors.lenth > 0 ? (
        <ErrorBox errors={errors} />
    ) : (
        <StudentPage setErrors={setErrors} />
    );
};

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);
