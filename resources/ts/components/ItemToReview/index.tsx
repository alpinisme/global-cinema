import React, { ReactElement, ReactNode } from 'react';
import styles from './ItemToReview.scss';

const ItemToReview = ({ children, name }: Props): ReactElement => (
    <li className={styles.item}>
        <em className={styles.current}>{name}</em>
        {children}
    </li>
);

export default ItemToReview;

interface Props {
    children: ReactNode;
    name: string;
}
