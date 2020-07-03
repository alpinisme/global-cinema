import React, { ReactElement } from 'react';
import type { Screening, Theater, Film } from '../types/api';

const SavedScreening = ({ data, handleDelete }: Props): ReactElement => {
    const { screening } = data;

    return (
        <li>
            {`${screening.theater} (${screening.title})`}
            <button className="delete" onClick={handleDelete}>
                delete
            </button>
        </li>
    );
};

export interface Props {
    data: {
        theaters: Theater[];
        films: Film[];
        screening: Screening;
    };
    handleDelete: () => void;
}

export default SavedScreening;
