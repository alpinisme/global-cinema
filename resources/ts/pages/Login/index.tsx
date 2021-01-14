import axios from 'axios';
import React, { useState, ReactElement, FormEvent } from 'react';
import ErrorBox from '../../components/ErrorBox';
import Register from '../Register';

export interface User {
    email: string;
    password: string;
    passwordConfirm?: string;
    remember?: boolean;
    role?: 'student' | 'instructor' | 'contributor';
    instructor?: string | null;
}

const LoginPage = ({ handleSuccess }: Props): ReactElement => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState(true);

    if (!isRegistered) {
        return <Register handleSuccess={handleSuccess} />;
    }

    const login = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        const errMsg = 'Something went wrong with your login. Contact a site admin.';

        axios
            .post('login', { password, email, remember })
            .then(res => res.data.role)
            .then(role => (role ? handleSuccess(role) : setError(errMsg)))
            .catch(err => console.log('oops', err.response.data.message));
    };

    return (
        <>
            <form onSubmit={login}>
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                ></input>

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                ></input>

                <label className="form-check-label" htmlFor="remember">
                    Remember Me
                </label>
                <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                />

                <button type="submit">Login</button>
            </form>

            {error && <ErrorBox errors={[error]} />}

            <div>
                Not registered yet?
                <button type="button" onClick={() => setIsRegistered(false)}>
                    Create an account
                </button>
            </div>
        </>
    );
};

export default LoginPage;

interface Props {
    handleSuccess: (role: string) => void;
}
