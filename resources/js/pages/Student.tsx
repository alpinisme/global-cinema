import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import Month from '../components/Month';

const Student = setErrors => {
    const [assignment, setAssignment] = useState('1900-01-01');

    /**
     * get student's assignment from api
     */
    useEffect(() => {
        axios
            .get('/assignment')
            .then(res => res.data)
            .then(setAssignment)
            .catch(console.log);
    }, []);

    return <Month month={assignment} setErrors={setErrors} />;
};

export default Student;
