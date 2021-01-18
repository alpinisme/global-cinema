import React, { ReactElement, useState, MouseEvent } from 'react';
import styles from './TreeList.scss';

const TreeList = ({ data }: Props): ReactElement => {
    const [active, setActive] = useState<string | null>(null);
    const handleClick = (id: string) => (e: MouseEvent) => {
        e.stopPropagation();
        if (id == active) {
            setActive(null);
        } else {
            setActive(id);
        }
    };

    const getStyles = item => {
        if (item.children.length == 0) {
            return '';
        } else if (item.id == active) {
            return styles.canClose;
        } else if (item.id != active) {
            return styles.canOpen;
        }
    };

    return (
        <ul>
            {data.map(item => (
                <li key={item.id} className={getStyles(item)} onClick={handleClick(item.id)}>
                    {item.name}
                    {item.id == active && <TreeList data={item.children} />}
                </li>
            ))}
        </ul>
    );
};

export default TreeList;

interface Props {
    data: Data[];
}

interface Data {
    name: string;
    id: string;
    children: Data[];
}
