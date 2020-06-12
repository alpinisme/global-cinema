import React, { ReactElement } from 'react';

const Screening = ({ data, handleDelete }: Props): ReactElement => {
    const { theaters, films, screening } = data;
    const theater = theaters.find(
        theater => theater.id == screening.theater_id
    ) as theater;
    const film = films.find(film => film.id == screening.film_id) as film;

    return (
        <li>
            {`${theater.name} (${film.title})`}
            <button className="delete" onClick={handleDelete}>
                delete
            </button>
        </li>
    );
};

interface theater {
    name: string;
    id: string;
}

interface film {
    title: string;
    id: string;
}

export interface Props {
    data: {
        theaters: theater[];
        films: film[];
        screening: {
            theater_id: string;
            film_id: string;
        };
    };
    handleDelete: () => void;
}

export default Screening;
