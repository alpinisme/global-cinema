import React, { useState, useCallback, ReactElement, useContext, useMemo } from 'react';
import axios from 'axios';
import ErrorBox from './ErrorBox';
import Select from './Select';
import Autosuggest from './Autosuggest';
import { addOnce } from '../utils/functions';
import type { Film, Screening } from '../types/api';
import { ScreeningsContext } from '../contexts/ScreeningsContext';
import useQuery from '../hooks/useQuery';
import { useHistory } from 'react-router';

const ScreeningEntry = ({ date, handleSuccess }: Props): ReactElement => {
    const { films, theaters, getFilms } = useContext(ScreeningsContext);
    const query = useQuery();
    const history = useHistory();
    const city = query.get('city');
    const [newTitle, setNewTitle] = useState<string | null>(null);

    if (city == null) {
        history.goBack();
        throw new Error('city required');
    }

    const [submissionError, setSubmissionError] = useState('');

    const init = useMemo(
        () => ({
            date: date.toISOString().slice(0, 10),
            city_id: Number(city),
        }),
        [city, date]
    );

    const year = date.toISOString().slice(0, 4);

    const [screening, setScreening] = useState<Partial<Screening>>(init);

    const suggestFilmsConfig = {
        label: 'Film Title',
        keys: ['title'],
        options: films,
        displayMatch: (match: Film) => `${match.title} (${match.year})`,
    };

    const handleSubmit = useCallback(
        id => {
            if (!screening.city_id || !screening.theater_id) {
                throw new Error('submission requires theater and city');
            }
            setScreening(init);
            setSubmissionError('');
            setNewTitle(null);

            const data = {
                ...screening,
                film_id: id,
            };

            axios
                .post('/screenings', data)
                .then(res => res.data)
                .then(handleSuccess)
                .catch(e => setSubmissionError(`Screening could not be saved: ${e}`));
        },
        [handleSuccess, init, screening]
    );

    return (
        <>
            <label htmlFor="theater-select">Theater</label>
            <Select
                id="theater-select"
                options={theaters
                    .filter(t => t.city_id == Number(city))
                    .map(t => ({ label: t.name, value: t.id }))}
                value={screening.theater_id?.toString() ?? ''}
                handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    e.persist();
                    setScreening(old => ({ ...old, theater_id: parseInt(e.target.value) }));
                }}
                autoFocus={true}
            />

            {screening.theater_id && (
                <Autosuggest
                    config={suggestFilmsConfig}
                    handleSubmit={handleSubmit}
                    handleManualAdd={setNewTitle}
                    handleInput={input => getFilms(input, year)}
                />
            )}

            {newTitle && <ConfirmYear film={newTitle} handleSubmit={handleSubmit} date={date} />}

            <ErrorBox errors={submissionError} />
        </>
    );
};

const ConfirmYear = ({ date, film, handleSubmit }: ConfirmYearProps) => {
    const [year, setYear] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const maxYear = date.getUTCFullYear();

    const validate = useCallback(
        (input: string): boolean => {
            const year = parseInt(input);
            if (1900 < year && year <= maxYear) {
                return true;
            }

            setValidationErrors(addOnce(`Please enter a valid year between 1901 and ${maxYear}`));
            return false;
        },
        [maxYear]
    );

    const handleClick = useCallback(() => {
        if (!validate(year)) {
            return;
        }
        setIsError(false);

        axios
            .post('/films', { title: film, year })
            .then(res => res.data.id)
            .then(handleSubmit)
            .catch(() => setIsError(true));
    }, [film, year, handleSubmit, setIsError, validate]);

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
                    if (e.key === 'Enter') {
                        handleClick();
                        setIsError(false);
                    }
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
            {validationErrors.length > 0 && <ErrorBox errors={validationErrors} />}
        </div>
    );
};

interface ConfirmYearProps {
    film: string;
    handleSubmit: (a: number) => void;
    date: Date;
}

export interface Props {
    date: Date;
    handleSuccess: (screening: Screening) => void;
}

export default ScreeningEntry;
