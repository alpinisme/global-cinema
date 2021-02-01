import React, { useState, ReactElement, FormEvent } from 'react';
import ErrorBox from '../../components/ErrorBox';
import { useAuth } from '../../utils/useAuth';
import Register from '../Register';
import styles from './Login.scss';

export interface User {
    email: string;
    password: string;
    passwordConfirm?: string;
    remember?: boolean;
    role?: 'student' | 'instructor' | 'contributor';
    instructor?: string | null;
}

const LoginPage = (): ReactElement => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const auth = useAuth();

    if (!isRegistered) {
        return <Register />;
    }

    const login = (e: FormEvent) => {
        e.preventDefault();
        auth.login({ password, email, remember });
    };

    return (
        <div>
            <h2 className={styles.header}>Login</h2>
            <form onSubmit={login} className={styles.container}>
                <div className={styles.field}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        className={styles.textbox}
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        autoFocus
                    ></input>
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className={styles.textbox}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    ></input>
                </div>

                <div className={styles.field}>
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
                </div>

                <button type="submit" className={styles.submit}>
                    Login
                </button>
            </form>

            {auth.errors.email && <ErrorBox errors={auth.errors.email} />}

            <div className={styles.container}>
                Not registered yet?
                <button
                    className={styles.register}
                    type="button"
                    onClick={() => setIsRegistered(false)}
                >
                    Create an account
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
