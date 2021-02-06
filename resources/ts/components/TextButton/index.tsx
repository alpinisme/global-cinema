import React, { ReactElement } from 'react';
import styles from './TextButton.scss';

const TextButton = ({ label, style, handleClick }: Props): ReactElement => {
    const className = style ? styles[style] : styles.approve;
    return (
        <button onClick={handleClick} className={className + ' ' + styles.button}>
            {label}
        </button>
    );
};

export default TextButton;

interface Props {
    label: string;
    style?: 'danger';
    handleClick: () => void;
}
