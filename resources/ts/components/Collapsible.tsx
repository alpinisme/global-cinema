import React, { ReactElement } from 'react';
import styles from './Collapsible.scss';

const Collapsible = ({ open, handleClick, children, label }: Props): ReactElement => {
    const contentClassName = open ? `${styles.content} ${styles.open}` : styles.content;

    const arrowClassName = open ? `${styles.arrow} ${styles.open}` : styles.arrow;

    const maxHeight = open ? 'none' : '0px';

    return (
        <>
            <div className={styles.div} onClick={handleClick}>
                <span className={styles.label}>{label}</span>
                <button className={styles.button}>
                    <span className={arrowClassName}></span>
                </button>
            </div>
            <div style={{ maxHeight }} className={contentClassName}>
                {children}
            </div>
        </>
    );
};

export default Collapsible;

export interface Props {
    open: boolean;
    handleClick: () => void;
    label: string;
    children: ReactElement;
}
