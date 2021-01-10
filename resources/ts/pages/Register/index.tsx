import React, { ReactElement, useState } from 'react';
import { User } from '../../types/api';
import { useGetRequest } from '../../utils/hooks';

const Register = (): ReactElement => {
    const [role, setRole] = useState('');
    const [instructors] = useGetRequest<User[]>('instructors', e => console.log(e));
    const [instructor, setInstructor] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');

    return (
        <form onSubmit={() => console.log('submitted')}>
            <label htmlFor="role">What is your role on this site?</label>
            <select name="role" id="role" value={role} onChange={e => setRole(e.target.value)}>
                <option value="" disabled>
                    Select one
                </option>
                <option value="student">student</option>
                <option value="instructor">instructor</option>
                <option value="contributor">contributor</option>
            </select>

            {role == 'student' && (
                <>
                    <label htmlFor="instructor">Your instructor&apos;s name</label>
                    <select
                        name="instructor"
                        id="instructor"
                        value={instructor}
                        onChange={e => setInstructor(e.target.value)}
                    >
                        {instructors?.map(instructor => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {role && (
                <>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        value={name}
                        required
                        onChange={e => setName(e.target.value)}
                    ></input>

                    <label htmlFor="name">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    ></input>

                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        required
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                    ></input>

                    <label htmlFor="password-confirmation">Confirm Password</label>
                    <input
                        name="password_confirmation"
                        id="password-confirmation"
                        type="password"
                        required
                        value={passConfirm}
                        onChange={e => setPassConfirm(e.target.value)}
                    ></input>
                </>
            )}
        </form>
    );
};

export default Register;
