import React, { useState, useCallback, ReactElement } from 'react';
import axios from 'axios';
import ErrorBox from './ErrorBox';
import Select from './Select';
import Autosuggest from './Autosuggest';
import { addOnce } from '../utils/functions';
import type { Film, Theater, Screening } from '../types/api';
import { useCityContext } from '../contexts/CityContext';

// const defaultCity = { id: 3 };

const ScreeningEntry = ({ theaters, films, date, addFilm, handleSuccess }: Props): ReactElement => {
    const initialFilmState = {
        id: 0,
        title: '',
        year: 0,
        isNew: false,
        matches: [],
    } as FilmSuggestion;

    const [theaterID, setTheaterID] = useState('');
    const [film, setFilm] = useState(initialFilmState);

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [submissionError, setSubmissionError] = useState('');
    const [city] = useCityContext();

    const maxYear = date.getUTCFullYear();

    const suggestFilmsConfig = {
        label: 'Film Title',
        keys: ['title'],
        options: films,
        displayMatch: (match: Film) => `${match.title} (${match.year})`,
    };

    // const handleSubmit = (id: number) => {
    //     if (theaterID) {
    //         setScreening({
    //             date: date.toISOString().slice(0, 10),
    //             city_id: city?.id ?? 0,
    //             theater_id: parseInt(theaterID),
    //             film_id: id,
    //         });
    //     } else {
    //         setValidationErrors(addOnce('Theater is required'));
    //     }
    //     // setFilm(old => ({ ...old, id }));
    //     // setIsSubmissionReady(true);
    // };

    const handleSubmit = useCallback(
        id => {
            if (!city || !theaterID) {
                throw new Error('submission requires theaterID and city');
            }
            setTheaterID('');
            setFilm(initialFilmState);
            setValidationErrors([]);
            setSubmissionError('');

            const screening = {
                date: date.toISOString().slice(0, 10),
                city_id: city ? city.id : 0,
                theater_id: parseInt(theaterID),
                film_id: id,
            };
            axios
                .post('/screenings', screening)
                .then(res => res.data)
                .then(handleSuccess)
                .catch(e => setSubmissionError(`Screening could not be saved: ${e}`));
        },
        [handleSuccess, initialFilmState, date, theaterID, city]
    );

    return (
        <>
            <label htmlFor="theater-select">Theater</label>
            <Select
                id="theater-select"
                options={theaters
                    .filter(t => t.city_id == city?.id)
                    .map(t => ({ label: t.name, value: t.id }))}
                value={theaterID}
                handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTheaterID(e.target.value)
                }
                autoFocus={true}
            />

            {theaterID && (
                <Autosuggest
                    config={suggestFilmsConfig}
                    handleSubmit={handleSubmit}
                    handleManualAdd={(title: string) =>
                        setFilm(old => ({ ...old, title, isNew: true }))
                    }
                />
            )}

            {film.isNew && (
                <ConfirmYear
                    film={film.title}
                    maxYear={maxYear}
                    addFilm={addFilm}
                    handleSubmit={handleSubmit}
                    handleValidationError={msg => setValidationErrors(addOnce(msg))}
                />
            )}

            {validationErrors.length > 0 && <ErrorBox errors={validationErrors} />}

            {submissionError.length > 0 && <ErrorBox errors={[submissionError]} />}
        </>
    );
};

const ConfirmYear = ({
    film,
    handleSubmit,
    handleValidationError,
    maxYear,
    addFilm,
}: ConfirmYearProps) => {
    const [year, setYear] = useState<string>('');
    const [isError, setIsError] = useState(false);

    const validate = useCallback(
        (input: string): boolean => {
            const year = parseInt(input);
            if (1900 < year && year <= maxYear) {
                return true;
            }

            handleValidationError(`Please enter a valid year between 1901 and ${maxYear}`);
            return false;
        },
        [maxYear, handleValidationError]
    );

    const handleClick = useCallback(() => {
        if (!validate(year)) {
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
    }, [film, year, handleSubmit, setIsError, validate, addFilm]);

    return (
        <div>
            Please confirm the spelling of the title above and add the film&apos;s release year
            below:
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
                    Sorry, something has gone wrong. Try refreshing the page and submitting again.
                    If that doesn&apos;t work, please contact a site administrator
                </p>
            )}
        </div>
    );
};

interface FilmSuggestion extends Film {
    isNew: boolean;
    matches: Film[];
}

interface ConfirmYearProps {
    film: string;
    handleSubmit: (a: number) => void;
    handleValidationError: (msg: string) => void;
    maxYear: number;
    addFilm: (f: Film) => void;
}

export interface Props {
    theaters: Theater[];
    films: Film[];
    date: Date;
    addFilm: (film: Film) => void;
    handleSuccess: (screening: Screening) => void;
}

export default ScreeningEntry;
