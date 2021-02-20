import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import ErrorBox from '../../components/ErrorBox';
import { User } from '../../types/api';
import { useGetRequest } from '../../hooks/requestHooks';
import { useAuth } from '../../hooks/useAuth';
import styles from './Register.scss';

const Register = (): ReactElement => {
    const [role, setRole] = useState('');
    const instructors = useGetRequest<User[]>('instructors');
    const [instructor, setInstructor] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const auth = useAuth();

    useEffect(() => {
        if (instructors.data) {
            const id = instructors.data[0].id.toString();
            setInstructor(id);
        }
    }, [instructors]);

    const register = (e: FormEvent) => {
        e.preventDefault();

        auth.register({
            role,
            instructor_id: instructor,
            name,
            email,
            password,
            password_confirmation: passConfirm,
        });
    };

    return (
        <form onSubmit={register} className={styles.container}>
            <h2 className={styles.header}>Register</h2>
            <div>
                <label htmlFor="role">What is your role on this site?</label>
                <select name="role" id="role" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="" disabled>
                        Select one
                    </option>
                    <option value="student">student</option>
                    <option value="unconfirmed_instructor">instructor</option>
                    <option value="unconfirmed_contributor">contributor</option>
                </select>
            </div>
            <ErrorBox errors={auth.errors.role} />

            {role == 'student' && (
                <div className={styles.field}>
                    <label htmlFor="instructor">Your instructor&apos;s name</label>
                    <select
                        name="instructor"
                        id="instructor"
                        value={instructor}
                        onChange={e => {
                            console.log('setting to', instructor);
                            setInstructor(e.target.value);
                        }}
                    >
                        {instructors.data?.map(instructor => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                    <ErrorBox errors={auth.errors.instructor} />
                </div>
            )}

            {role && (
                <>
                    <div className={styles.field}>
                        <label htmlFor="name">Name</label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            className={styles.textbox}
                            value={name}
                            required
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <ErrorBox errors={auth.errors.name} />
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            className={styles.textbox}
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <ErrorBox errors={auth.errors.email} />
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className={styles.textbox}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <ErrorBox errors={auth.errors.password} />
                    <div className={styles.field}>
                        <label htmlFor="password-confirmation">Confirm Password</label>
                        <input
                            name="password_confirmation"
                            id="password-confirmation"
                            type="password"
                            autoComplete="new-password"
                            className={styles.textbox}
                            required
                            value={passConfirm}
                            onChange={e => setPassConfirm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={styles.submit}>
                        Register
                    </button>
                </>
            )}
        </form>
    );
};

export default Register;
