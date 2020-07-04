import React, { ReactElement } from 'react';
import styles from './ErrorBox.scss';

const ErrorBox = ({ errors }: Props): ReactElement => {
    const errList = errors.map(e => (
        <ul key={e} className={styles.box}>
            <li className={styles.message} role="alert">
                {e}
            </li>
        </ul>
    ));

    return <>{errList}</>;
};

export default ErrorBox;

export interface Props {
    errors: string[];
}
