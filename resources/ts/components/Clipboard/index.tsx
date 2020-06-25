import React, { ReactElement, useRef, SyntheticEvent, useState } from 'react';
import styles from './Clipboard.scss';

const Clipboard = ({ content }: Props): ReactElement => {
    const textArea = useRef<HTMLTextAreaElement | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const copy = (e: SyntheticEvent<HTMLButtonElement>) => {
        textArea.current?.select();
        document.execCommand('copy');
        e.currentTarget.focus();
        setIsCopied(true);
    };

    return (
        <>
            <div className={styles.container}>
                <textarea readOnly value={content} className={styles.textArea} ref={textArea} />
                <button className={styles.button} onClick={copy}>
                    {isCopied ? (
                        <>
                            <img
                                className={styles.icon}
                                src="https://img.icons8.com/fluent/48/000000/ok.png"
                            />
                            copied
                        </>
                    ) : (
                        <>
                            <img
                                className={styles.icon}
                                src="https://img.icons8.com/office/16/000000/copy.png"
                            />
                            copy
                        </>
                    )}
                </button>
            </div>
            {isCopied && <button className={styles.reset}>reset another password?</button>}
        </>
    );
};

export interface Props {
    content: string;
}

export default Clipboard;
