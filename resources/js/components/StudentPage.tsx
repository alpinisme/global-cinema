import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import Day from './Day';
import DaySelector from './DaySelector';
import { Film, Theater } from './ScreeningEntry';

export interface Props {
    setErrors: (e: string) => void;
}

const StudentPage = ({ setErrors }: Props): ReactElement => {
    const initialDate = new Date('1999-12-12');
    const [assignment, setAssignment] = useState('1900-01-01');
    const [date, setDate] = useState(initialDate);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [films, setFilms] = useState<Film[]>([]);
    const [isDateSelected, setIsDateSelected] = useState(false);

    /**
     * get student's assignment from api
     */
    useEffect(() => {
        axios
            .get('/assignment')
            .then(res => res.data)
            .then(setAssignment)
            .catch(console.log);
    }, []);

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

    const handleDateSelection = (date: Date) => {
        setDate(date);
        setIsDateSelected(true);
    };

    return isDateSelected ? (
        <Day
            date={date}
            handleCancel={() => setIsDateSelected(false)}
            theaters={theaters}
            films={films}
            addFilm={film => setFilms(old => [film, ...old])}
        />
    ) : (
        <DaySelector date={assignment} handleClick={handleDateSelection} />
    );
};

export default StudentPage;
