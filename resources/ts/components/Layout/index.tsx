import React, { ReactElement, ReactNode } from 'react';
import Footer from '../Footer';
import NavBar from '../NavBar';
import styles from './Layout.scss';

const Layout = ({ children }: Props): ReactElement => {
    return (
        <div className={styles.parent}>
            <NavBar />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;

interface Props {
    children: ReactNode;
}
