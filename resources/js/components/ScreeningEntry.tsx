import React, { useState, useEffect, useCallback, ReactElement, SyntheticEvent } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import ErrorBox from './ErrorBox';
import Select from './Select';
import { addOnce } from '../utils/functions';
import type { Film, Theater, Screening } from '../types/apiInterfaces';

interface ConfirmYearProps {
    film: string;
    handleSubmit: (a: string) => void;
    handleValidationError: (msg: string) => void;
    maxYear: number;
    addFilm: (f: Film) => void;
}
const ConfirmYear = ({
    film,
    handleSubmit,
    handleValidationError,
    maxYear,
    addFilm
}: ConfirmYearProps) => {
    const [year, setYear] = useState<string>('');
    const [isError, setIsError] = useState(false);

    const handleClick = useCallback(() => {
        if (!(parseInt(year) > 1900 && parseInt(year) <= maxYear)) {
            handleValidationError(
                `Please enter a valid year between 1901 and ${maxYear}`
            );
            return;
        }
        setIsError(false);

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

export interface MatchesProps {
    matches: Film[];
    handleSubmit: (e: SyntheticEvent<HTMLButtonElement>) => void;
    handleManualAdd: () => void;
}

const Matches = ({ matches, handleSubmit, handleManualAdd }: MatchesProps) => (
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
                Sorry, no matches found. It looks like we need some additional
                info to identify the film.
            </p>
        )}
        <button onClick={handleManualAdd}>Add film manually</button>
    </>
);

interface FilmSuggestion extends Film {
    isNew: boolean,
    matches: Film[]
}

const ScreeningEntry = ({
    theaters,
    films,
    date,
    addFilm,
    handleSuccess
}: Props): ReactElement => {
    const initialFilmState = {
        id: 0,
        title: '',
        year: 0,
        isNew: false,
        matches: []
    } as FilmSuggestion;
    const [theaterID, setTheaterID] = useState('');
    const [film, setFilm] = useState(initialFilmState);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
                setValidationErrors(addOnce('Theater is required'));
                return;
            }

            const data = {
                film_id: film.id,
                theater_id: theaterID,
                date: date.toISOString().slice(0, 10)
            };

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
                handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTheaterID(e.target.value)
                }
                autoFocus={true}
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
                    handleSubmit={(e: SyntheticEvent<HTMLButtonElement>) => handleSubmit(e.currentTarget.dataset.film)}
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
                    handleValidationError={msg =>
                        setValidationErrors(addOnce(msg))
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

export interface Props {
    theaters: Theater[];
    films: Film[];
    date: Date;
    addFilm: (film: Film) => void;
    handleSuccess: (screening: Screening) => void;
}

export default ScreeningEntry;


/*
Argument of type '(old: FilmSuggestion) => { matches: Film[]; isNew: boolean; id: string; title: string; year: string; }' is not assignable to parameter of type 'SetStateAction<FilmSuggestion>'.
  Type '(old: FilmSuggestion) => { matches: Film[]; isNew: boolean; id: string; title: string; year: string; }' is not assignable to type '(prevState: FilmSuggestion) => FilmSuggestion'.
    Call signature return types '{ matches: Film[]; isNew: boolean; id: string; title: string; year: string; }' and 'FilmSuggestion' are incompatible.
      The types of 'matches.length' are incompatible between these types.
        Type 'number' is not assignable to type '0'.ts(2345)
*/