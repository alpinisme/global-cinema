import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Fuse from 'fuse.js';

import ErrorBox from './ErrorBox';
import Select from './Select';

const ConfirmYear = ({
    film,
    handleSubmit,
    handleValidationError,
    maxYear,
    addFilm
}) => {
    const [year, setYear] = useState('');
    const [isError, setIsError] = useState(false);

    const handleClick = useCallback(() => {
        if (year < 1900 || year > maxYear || parseInt(year) != year) {
            handleValidationError(
                `Please enter a valid year between 1900 and ${maxYear}`
            );
            return;
        }
        setIsError(false);

        console.log('submitting film: ', { title: film, year });
        axios
            .post('/films', { title: film, year })
            .then(res => {
                addFilm(res.data);
                return res.data.id;
            })
            .then(handleSubmit)
            .catch(() => setIsError(true));
    }, [film, year]);

    return (
        <div>
            Please confirm the spelling of the title above and add the
            film&apos;s release year below:
            <input
                type="text"
                required
                autoFocus
                placeholder="1977"
                value={year}
                onChange={e => setYear(e.target.value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') handleClick();
                }}
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

const Matches = ({ matches, handleSubmit, handleManualAdd }) => (
    <>
        {matches.length > 0 && (
            <p>Select the correct title to submit the entry.</p>
        )}
        <ul className="button-list">
            {matches.map(match => (
                <li key={match.id}>
                    <button
                        type="submit"
                        data-film={match.id}
                        onClick={handleSubmit}
                    >
                        {match.title + ' (' + match.year + ')'}
                    </button>
                </li>
            ))}
        </ul>
        {matches.length > 0 ? (
            <p>If the correct film is not listed above, </p>
        ) : (
            <p>
                Sorry, no matches found. It looks like we need some addition
                info to identify the film.
            </p>
        )}
        <button onClick={handleManualAdd}>Add film manually</button>
    </>
);

const ScreeningEntry = ({ theaters, films, date, addFilm, handleSuccess }) => {
    const initialFilmState = {
        id: '',
        title: '',
        isNew: false,
        matches: []
    };
    const [theaterID, setTheaterID] = useState('');
    const [film, setFilm] = useState(initialFilmState);
    const [validationErrors, setValidationErrors] = useState([]);
    const [submissionError, setSubmissionError] = useState('');
    const [isSubmissionReady, setIsSubmissionReady] = useState(false);

    const maxYear = date.getUTCFullYear();

    const handleSubmit = id => {
        setFilm(old => ({ ...old, id }));
        setIsSubmissionReady(true);
    };

    const resetState = () => {
        setTheaterID('');
        setFilm(initialFilmState);
        setValidationErrors([]);
        setSubmissionError('');
    };

    // find five closest matches for user-input title in db
    useEffect(() => {
        const options = {
            shouldSort: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: ['title']
        };

        const fuse = new Fuse(films, options);
        const all = fuse.search(film.title);
        const top5 = all.slice(0, 4);

        setFilm(old => ({ ...old, matches: top5 }));
    }, [films, film.title]);

    // submit screening if ready
    useEffect(() => {
        if (isSubmissionReady) {
            setIsSubmissionReady(false);
            setSubmissionError('');

            if (theaterID == '') {
                setValidationErrors(old => ['Theater is required', ...old]);
                return;
            }

            const data = {
                film_id: film.id,
                theater_id: theaterID,
                date: date.toISOString().slice(0, 10)
            };

            console.log('submitting: ', data);

            axios
                .post('/screenings', data)
                .then(res => res.data)
                .then(handleSuccess)
                .then(resetState)
                .catch(e =>
                    setSubmissionError(`Screening could not be saved: ${e}`)
                );
        }
    }, [isSubmissionReady]);

    return (
        <>
            <label htmlFor="theater-select">Theater</label>
            <Select
                id="theater-select"
                options={theaters.map(t => ({ label: t.name, value: t.id }))}
                value={theaterID}
                handleChange={e => setTheaterID(e.target.value)}
            />

            {theaterID && (
                <div>
                    <label htmlFor="film">Film Title</label>
                    <input
                        type="text"
                        name="film"
                        value={film.title}
                        onChange={e => {
                            const title = e.target.value;
                            setFilm(old => ({ ...old, title }));
                        }}
                    />

                    {!film.title && (
                        <p>
                            As you begin typing a film title, possible matches
                            will appear below.
                        </p>
                    )}
                </div>
            )}

            {film.title && (
                <Matches
                    matches={film.matches}
                    handleSubmit={e => handleSubmit(e.target.dataset.film)}
                    handleManualAdd={() =>
                        setFilm(old => ({ ...old, isNew: true }))
                    }
                />
            )}

            {film.isNew && (
                <ConfirmYear
                    film={film.title}
                    maxYear={maxYear}
                    addFilm={addFilm}
                    handleSubmit={handleSubmit}
                    handleValidationError={() =>
                        setValidationErrors(old => [
                            'Please enter a valid date',
                            ...old
                        ])
                    }
                />
            )}

            {validationErrors.length > 0 && (
                <ErrorBox errors={validationErrors} />
            )}

            {submissionError.length > 0 && (
                <ErrorBox errors={[submissionError]} />
            )}
        </>
    );
};

ScreeningEntry.propTypes = {
    theaters: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    films: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    date: PropTypes.object.isRequired,
    addFilm: PropTypes.func.isRequired,
    handleSuccess: PropTypes.func.isRequired
};

ConfirmYear.propTypes = {
    film: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleValidationError: PropTypes.func.isRequired,
    maxYear: PropTypes.number.isRequired,
    addFilm: PropTypes.func.isRequired
};

Matches.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleManualAdd: PropTypes.func.isRequired,
    matches: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired
};

export default ScreeningEntry;
