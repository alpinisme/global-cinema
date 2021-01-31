import React, { ReactElement } from 'react';
import { useAuth } from '../../utils/useAuth';
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
                    <a href="/login" className="user-link">
                        login
                    </a>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
