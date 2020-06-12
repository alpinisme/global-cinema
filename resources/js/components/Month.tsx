import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import Day from './Day';
import DaySelector from './DaySelector';
import { Film, Theater } from '../types/apiInterfaces';

const Month = ({ month, setErrors }: Props): ReactElement => {
    const [date, setDate] = useState<Date | null>(null);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [films, setFilms] = useState<Film[]>([]);

    /**
     * loads theaters from api
     */
    useEffect(() => {
        axios
            .get('/theaters')
            .then(res => res.data)
            .then(setTheaters)
            .catch(e => setErrors(`Theaters could not be loaded: ${e}`));
    }, []);

    /**
     * loads films from api
     */
    useEffect(() => {
        axios
            .get('/films')
            .then(res => res.data)
            .then(setFilms)
            .catch(e => setErrors(`Films could not be loaded: ${e}`));
    }, []);

    return date ? (
        <Day
            date={date}
            theaters={theaters}
            films={films}
            cancel={() => setDate(null)}
            addFilm={film => setFilms(old => [film, ...old])}
        />
    ) : (
        <DaySelector month={month} handleClick={setDate} />
    );
};

export default Month;

export interface Props {
    setErrors: (e: string) => void;
    month: string;
}
