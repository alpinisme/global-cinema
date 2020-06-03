import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const InstructorPage = ({ setErrors }) => {
    const [studentData, setStudentData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

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

    const margin = {
        marginTop: '2rem'
    };

    return studentData ? (
        <>
            <h2 style={margin}>Instructor Overview</h2>
            <p>
                click on specific rows for a full list of days completed by a
                student (at page bottom)
            </p>
            <table style={margin}>
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
                        <tr
                            key={student.info.id}
                            onClick={() => setSelectedStudent(student)}
                        >
                            <td>{student.info.name}</td>
                            <td>{student.info.email}</td>
                            <td>{student.datesCompleted.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedStudent && (
                <div className="box">
                    <ul>
                        {selectedStudent.datesCompleted.map(date => (
                            <li key={date}>{date}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    ) : (
        '...loading'
    );
};
InstructorPage.propTypes = {
    setErrors: PropTypes.func.isRequired
};

export default InstructorPage;
