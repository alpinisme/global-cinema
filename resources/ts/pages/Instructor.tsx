import React, { useEffect, useState, CSSProperties, ReactElement } from 'react';
import axios from 'axios';
import type { Student } from '../types/api';

const InstructorPage = ({ setErrors }: Props): ReactElement => {
    const [studentData, setStudentData] = useState<Student[] | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );

    const alphabetizeByEmail = (a: Student, b: Student) => {
        const emailA = a.info.email.toLowerCase();
        const emailB = b.info.email.toLowerCase();
        if (emailA > emailB) {
            return 1;
        }
        if (emailA < emailB) {
            return -1;
        }
        return 0;
    };

    /**
     * get student data from api
     */
    useEffect(() => {
        axios
            .get('/instructor')
            .then(res => res.data as Student[])
            .then(d => d.sort(alphabetizeByEmail))
            .then(setStudentData)
            .catch(() => setErrors('could not load student data'));
    }, []);

    const titleStyle: CSSProperties = {
        fontWeight: 'bold',
        padding: '0.5rem',
    };

    const margin = {
        marginTop: '2rem',
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
                        <td colSpan={3} style={{ textAlign: 'center' }}>
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
        <div>...loading</div>
    );
};

export interface Props {
    setErrors: (e: string) => void;
}

export default InstructorPage;
