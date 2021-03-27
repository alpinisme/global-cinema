import React, { ReactElement, ReactNode } from 'react';
import styles from './ContentContainer.scss';

const ContentContainer = ({ children }: Props): ReactElement => {
    return <div className={styles.content}>{children}</div>;
};

export default ContentContainer;

interface Props {
    children: ReactNode;
}
