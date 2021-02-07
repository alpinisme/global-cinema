import React, { ReactElement } from 'react';
import styles from './ErrorBox.scss';

const ErrorBox = ({ errors }: Props): ReactElement => {
    if (!errors || errors.length == 0) {
        return <></>;
    }

    if (typeof errors == 'string') {
        return (
            <div className={styles.message} role="alert">
                {errors}
            </div>
        );
    }

    return (
        <ul className={styles.box}>
            {errors.map(e => (
                <li key={e} className={styles.message} role="alert">
                    {e}
                </li>
            ))}
        </ul>
    );
};

export default ErrorBox;

export interface Props {
    errors?: string[] | string;
}
