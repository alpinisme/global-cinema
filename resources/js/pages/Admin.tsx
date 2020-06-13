import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import { Film, Theater } from '../types/apiInterfaces';
import Month from '../components/Month';
import MonthPicker from '../components/MonthPicker';

const AdminPage = ({ setErrors }: Props): ReactElement => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [films, setFilms] = useState<Film[]>([]);
    const [month, setMonth] = useState<string | null>(null);

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

    return (
        <>
            {month ? (
                <Month
                    month={month}
                    films={films}
                    theaters={theaters}
                    addFilm={film => setFilms(old => [film, ...old])}
                    cancel={() => setMonth(null)}
                />
            ) : (
                <MonthPicker setMonth={setMonth} />
            )}
        </>
    );
};

export interface Props {
    setErrors: (e: string) => void;
}

export default AdminPage;
