import React, { ReactElement } from 'react';
import type { Screening } from '../../types/api';

const SavedScreening = ({ screening, handleDelete }: Props): ReactElement => (
    <li>
        {`${screening.theater.name} (${screening.film.title})`}
        <button className="delete" onClick={handleDelete}>
            delete
        </button>
    </li>
);

export interface Props {
    screening: Screening;
    handleDelete: () => void;
}

export default SavedScreening;
