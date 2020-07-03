import React, { ReactElement } from 'react';
import type { Screening, Theater, Film } from '../types/api';

const SavedScreening = ({ data, handleDelete }: Props): ReactElement => {
    const { screening, theaters, films } = data;

    const theater = screening.theater ?? theaters.find(t => t.id == screening.theater_id)?.name;
    const film = screening.title ?? films.find(film => film.id == screening.film_id)?.title;

    return (
        <li>
            {`${theater} (${film})`}
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
