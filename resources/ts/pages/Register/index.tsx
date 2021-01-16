import axios from 'axios';
import React, { FormEvent, ReactElement, useState } from 'react';
import { User } from '../../types/api';
import { useGetRequest } from '../../utils/hooks';

const Register = ({ handleSuccess }: Props): ReactElement => {
    const [role, setRole] = useState('');
    const [instructors] = useGetRequest<User[]>('instructors', e => console.log(e));
    const [instructor, setInstructor] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [errors, setErrors] = useState<Form | null>(null);

    const register = (e: FormEvent) => {
        e.preventDefault();
        const data = {
            role,
            instructor,
            name,
            email,
            password,
            password_confirmation: passConfirm,
        } as Form;

        axios
            .post('register', data)
            .then(() => handleSuccess(role))
            .catch(err => setErrors(err.response.data.errors));
    };

    return (
        <form onSubmit={register}>
            <label htmlFor="role">What is your role on this site?</label>
            <select name="role" id="role" value={role} onChange={e => setRole(e.target.value)}>
                <option value="" disabled>
                    Select one
                </option>
                <option value="student">student</option>
                <option value="unconfirmed_instructor">instructor</option>
                <option value="unconfirmed_contributor">contributor</option>
            </select>
            {errors && errors.role}

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
                    {errors && errors.instructor}
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
                    />
                    {errors && errors.name}

                    <label htmlFor="name">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {errors && errors.email}

                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {errors && errors.password}

                    <label htmlFor="password-confirmation">Confirm Password</label>
                    <input
                        name="password_confirmation"
                        id="password-confirmation"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={passConfirm}
                        onChange={e => setPassConfirm(e.target.value)}
                    />
                    {errors && errors['password-confirmation']}

                    <button type="submit">Register</button>
                </>
            )}
        </form>
    );
};

export default Register;

interface Props {
    handleSuccess: (role: string) => void;
}

interface Form {
    role: string;
    instructor: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
