import React, { ReactElement, useRef, SyntheticEvent } from 'react';
import styles from './Clipboard.scss';

const Clipboard = ({ content }: Props): ReactElement => {
    const textArea = useRef<HTMLTextAreaElement | null>(null);

    const copy = (e: SyntheticEvent<HTMLButtonElement>) => {
        textArea.current?.select();
        document.execCommand('copy');
        e.currentTarget.focus();
    };

    return (
        <div className={styles.container}>
            <textarea
                readOnly
                value={content}
                className={styles.textArea}
                ref={textArea}
            />
            <button className={styles.button} onClick={copy}>
                <img
                    className={styles.icon}
                    src="https://img.icons8.com/office/16/000000/copy.png"
                />
                copy
            </button>
        </div>
    );
};

export interface Props {
    content: string;
}

export default Clipboard;
