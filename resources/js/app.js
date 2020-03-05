import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Day from './components/Day';
import DaySelector from './components/DaySelector';
import ErrorBox from './components/ErrorBox';

const assignment = '1999-02-01';

const Root = () => {
    const [errors, setErrors] = useState([]);

    return errors.lenth > 0 ? (
        <ErrorBox errors={errors} />
    ) : (
        <App setErrors={setErrors} />
    );
};

const App = ({ setErrors }) => {
    const initialDate = '1999-12-12';
    const [date, setDate] = useState(initialDate);
    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
    const [isDateSelected, setIsDateSelected] = useState(false);

    const handleDateSelection = date => {
        setDate(date);
        setIsDateSelected(true);
    };

    /**
     * loads screenings from api
     */
    useEffect(() => {
        axios
            .get('/screenings')
            .then(res => res.data)
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

    return isDateSelected ? (
        <Day
            date={date}
            handleComplete={() => setIsDateSelected(false)}
            handleCancel={() => setIsDateSelected(false)}
            theaters={theaters}
            films={films}
            addFilm={film => setFilms(old => [film, ...old])}
        />
    ) : (
        <DaySelector date={assignment} handleClick={handleDateSelection} />
    );
};

App.propTypes = {
    setErrors: PropTypes.func.isRequired
};

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);
