import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Student } from '../../types/api';
import styles from './Instructor.scss';

const InstructorPage = ({ useGetRequest }: Props): ReactElement => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

    const [studentData] = useGetRequest<Student[]>(
        '/grading',
        e => `Student data could not be loaded: ${e}`
    );

    return studentData ? (
        <>
            <h2 className={styles.margin}>Instructor Overview</h2>
            <p>
                click on specific rows for a full list of days completed by a student (at page
                bottom)
            </p>
            <table className={styles.margin}>
                <thead className={styles.title}>
                    <tr>
                        <td colSpan={3} className={styles.td}>
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
                    {studentData.sort(alphabetizeByEmail).map(student => (
                        <tr key={student.info.id} onClick={() => setSelectedStudent(student)}>
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
    useGetRequest: <A>(
        url: string,
        createErrMsg: (e: string) => string
    ) => [A | null, Dispatch<SetStateAction<A | null>>];
}

export default InstructorPage;
