import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './NavBar.scss';

const NavBar = (): ReactElement => {
    const auth = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={styles.authLinks}>
                {auth.user ? (
                    <a href="/logout" className="user-link">
                        logout
                    </a>
                ) : (
                    <Link to="/login" className="user-link">
                        login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
