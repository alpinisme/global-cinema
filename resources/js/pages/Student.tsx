import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import Month from '../components/Month';
import { Film, Theater } from '../types/apiInterfaces';

const Student = ({ setErrors }: Props): ReactElement => {
    const [assignment, setAssignment] = useState('1900-01-01');
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

    /**
     * get student's assignment from api
     */
    useEffect(() => {
        axios
            .get('/assignment')
            .then(res => res.data)
            .then(setAssignment)
            .catch(e => setErrors(`Theaters could not be loaded: ${e}`));
    }, []);

    return (
        <Month
            month={assignment}
            theaters={theaters}
            films={films}
            addFilm={film => setFilms(old => [film, ...old])}
        />
    );
};

export interface Props {
    setErrors: (msg: string) => void;
}

export default Student;
