import React from 'react';
import PropTypes from 'prop-types';

const Screening = ({ data, handleDelete }) => {
    const { theaters, films, screening } = data;
    const theater = theaters.find(
        theater => theater.id == screening.theater_id
    );
    const film = films.find(film => film.id == screening.film_id);

    return (
        <li>
            {`${theater.name} (${film.title})`}
            <button className="delete" onClick={handleDelete}>
                delete
            </button>
        </li>
    );
};

Screening.propTypes = {
    data: PropTypes.object.isRequired,
    handleDelete: PropTypes.func.isRequired
};

export default Screening;
