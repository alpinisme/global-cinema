import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Day from './Day';
import DaySelector from './DaySelector';

const StudentPage = ({ setErrors }) => {
    const initialDate = '1999-12-12';
    const [assignment, setAssignment] = useState('1900-01-01');
    const [date, setDate] = useState(initialDate);
    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
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
            .catch(e =>
                setErrors(old => [`Theaters could not be loaded: ${e}`, ...old])
            );
    }, []);

    /**
     * loads films from api
     */
    useEffect(() => {
        axios
            .get('/films')
            .then(res => res.data)
            .then(setFilms)
            .catch(e =>
                setErrors(old => [`Films could not be loaded: ${e}`, ...old])
            );
    }, []);

    const handleDateSelection = date => {
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

StudentPage.propTypes = {
    setErrors: PropTypes.func.isRequired
};

export default StudentPage;
