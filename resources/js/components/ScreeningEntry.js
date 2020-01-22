import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Fuse from 'fuse.js';

const ConfirmYear = ({ film, submitScreening }) => {
    const [year, setYear] = useState('');
    const [isError, setIsError] = useState(false);

    const handleClick = useCallback(() => {
        console.log('submitting film: ', { title: film, year });
        axios
            .post('/films', { title: film, year })
            .then(res => res.data.id)
            .then(submitScreening)
            .catch(e => console.log('no go: ', e));
        false && setIsError(true);
    }, [film, year]);

    return (
        <div>
            Please confirm the spelling of the title above and add the
            film&apos;s release year below:
            <input
                type="text"
                required
                placeholder="1977"
                value={year}
                onChange={e => setYear(e.target.value)}
            />
            <button type="submit" onClick={handleClick}>
                Confirm Film
            </button>
            {isError && (
                <p className="err-msg">
                    Sorry, something has gone wrong. Try submitting again, or
                    contact a site administrator
                </p>
            )}
        </div>
    );
};

const Matches = ({ matches, handleFilmSelection, setIsNewFilm }) => (
    <>
        {matches.length > 0 && (
            <p>Select the correct title to submit the entry.</p>
        )}
        {matches.map(match => (
            <button
                type="submit"
                data-film={match.id}
                key={match.id}
                onClick={handleFilmSelection}
            >
                {match.title + ' (' + match.year + ')'}
            </button>
        ))}
        {matches.length > 0 ? (
            <p>If the correct film is not listed above, </p>
        ) : (
            <p>
                Sorry, no matches found. It looks like we need some addition
                info to identify the film.
            </p>
        )}
        <button onClick={() => setIsNewFilm(true)}>Add film manually</button>
    </>
);

const ScreeningEntry = ({ date, theaters, saveScreening, films }) => {
    const [film, setFilm] = useState('');
    const [theater, setTheater] = useState('');
    const [isNewFilm, setIsNewFilm] = useState(false);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const options = {
            shouldSort: true,
            threshold: 0.4,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: ['title']
        };

        const fuse = new Fuse(films, options);

        setMatches(fuse.search(film).slice(0, 5));
    }, [films, film]);

    const handleFilmSelection = useCallback(
        event =>
            saveScreening({
                date,
                film_id: event.target.dataset.film,
                theater_id: theater
            }),
        [theater]
    );

    const handleNewFilmSubmission = useCallback(
        film => {
            console.log(films);
            console.log('submitting', {
                date,
                film_id: film,
                theater_id: theater
            });
            saveScreening({ date, film_id: film, theater_id: theater });
        },
        [theater]
    );

    return (
        <>
            <label htmlFor="theater-select">Theater</label>
            <Select
                id="theater-select"
                options={theaters.map(t => ({ label: t.name, value: t.id }))}
                value={theater}
                handleChange={e => setTheater(e.target.value)}
            />

            <label htmlFor="film">Film Title</label>
            <input
                type="text"
                name="film"
                value={film}
                onChange={e => setFilm(e.target.value)}
            />

            <p>
                As you begin typing a film title, possible matches will appear
                below.
            </p>

            {film && (
                <Matches
                    matches={matches}
                    film={film}
                    handleFilmSelection={handleFilmSelection}
                    setIsNewFilm={setIsNewFilm}
                />
            )}

            {isNewFilm && (
                <ConfirmYear
                    film={film}
                    submitScreening={handleNewFilmSubmission}
                />
            )}
        </>
    );
};

const Select = ({ id, options, value, handleChange }) => (
    <select id={id} value={value} onChange={handleChange} autoFocus>
        <option disabled value="">
            Select...
        </option>

        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

ScreeningEntry.propTypes = {
    theaters: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    films: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    saveScreening: PropTypes.func.isRequired,
    date: PropTypes.string.isRequired
};

ConfirmYear.propTypes = {
    film: PropTypes.string.isRequired,
    submitScreening: PropTypes.func.isRequired
};

Matches.propTypes = {
    handleFilmSelection: PropTypes.func.isRequired,
    setIsNewFilm: PropTypes.func.isRequired,
    matches: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default ScreeningEntry;
