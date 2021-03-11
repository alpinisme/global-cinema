import axios from 'axios';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './NavBar.scss';

const NavBar = (): ReactElement => {
    const auth = useAuth();

    const handleLogout = e => {
        e.preventDefault();
        axios.post('/logout').then(() => auth.logout());
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.authLinks}>
                {auth.user ? (
                    <a href="/logout" onClick={handleLogout}>
                        logout
                    </a>
                ) : (
                    <Link to="/login">login</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
