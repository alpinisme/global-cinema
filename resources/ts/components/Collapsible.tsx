import React, { ReactElement } from 'react';
import styles from './Collapsible.scss';

const Collapsible = ({
    open,
    handleClick,
    children,
    buttonLabel,
}: Props): ReactElement => {
    const contentClassName = open
        ? `${styles.content} ${styles.open}`
        : styles.content;

    const arrowClassName = open
        ? `${styles.arrow} ${styles.open}`
        : styles.arrow;

    return (
        <>
            <div className={styles.div} onClick={handleClick}>
                <span className={styles.label}>{buttonLabel}</span>
                <button className={styles.button}>
                    <span className={arrowClassName}></span>
                </button>
            </div>
            <div className={contentClassName}>{children}</div>
        </>
    );
};

export default Collapsible;

export interface Props {
    open: boolean;
    handleClick: () => void;
    buttonLabel: string;
    children: ReactElement;
}
