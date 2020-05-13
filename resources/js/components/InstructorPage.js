import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const InstructorPage = ({ setErrors }) => {
    const [studentData, setStudentData] = useState(null);

    /**
     * get student data from api
     */
    useEffect(() => {
        axios
            .get('/instructor')
            .then(res => res.data)
            .then(d => d.sort((a, b) => a.info.email > b.info.email))
            .then(setStudentData)
            .catch(setErrors(errs => errs.push('could not load student data')));
    }, []);

    const titleStyle = {
        fontWeight: 'bold',
        padding: '0.5rem'
    };

    return studentData ? (
        <table style={{ marginTop: '2rem' }}>
            <thead style={titleStyle}>
                <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                        Number of Days Your Students Completed
                    </td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>email</td>
                    <td>days completed</td>
                </tr>
            </thead>
            <tbody>
                {studentData.map(student => (
                    <tr key={student.info.id}>
                        <td>{student.info.name}</td>
                        <td>{student.info.email}</td>
                        <td>{student.datesCompleted.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        '...loading'
    );
};

export default InstructorPage;
