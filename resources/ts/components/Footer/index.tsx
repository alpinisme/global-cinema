import React, { ReactElement } from 'react';
import styles from './Footer.scss';

const Footer = (): ReactElement => (
    <footer className={styles.footer}>
        <p>
            project funded by <a href="http://ncsa.illinois.edu">NCSA</a> at the{' '}
            <a href="http://www.illinois.edu">University of Illinois</a>
        </p>
    </footer>
);

export default Footer;
