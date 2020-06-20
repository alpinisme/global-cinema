import React, { ReactElement, useRef } from 'react';
import styles from './Collapsible.scss';

const Collapsible = ({ open, handleClick, children, buttonLabel }: Props): ReactElement => {
    const contentRef = useRef<HTMLDivElement>(null);

    const contentClassName = open ? `${styles.content} ${styles.open}` : styles.content;

    const arrowClassName = open ? `${styles.arrow} ${styles.open}` : styles.arrow;

    const maxHeight = open ? contentRef.current?.scrollHeight + 'px' : '0px';
    return (
        <>
            <div className={styles.div} onClick={handleClick}>
                <span className={styles.label}>{buttonLabel}</span>
                <button className={styles.button}>
                    <span className={arrowClassName}></span>
                </button>
            </div>
            <div ref={contentRef} style={{ maxHeight }} className={contentClassName}>
                {children}
            </div>
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
