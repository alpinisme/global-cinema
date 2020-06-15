import React, { ReactElement } from 'react';
import type { Screening, Theater, Film } from '../types/api';

const SavedScreening = ({ data, handleDelete }: Props): ReactElement => {
    const { theaters, films, screening } = data;

    // we can assume that these two `find` calls will be valid, because
    // screenings must have valid film_id and theater_id as per SQL constraints
    const theater = theaters.find(
        theater => theater.id == screening.theater_id
    ) as Theater;
    const film = films.find(film => film.id == screening.film_id) as Film;

    return (
        <li>
            {`${theater.name} (${film.title})`}
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
