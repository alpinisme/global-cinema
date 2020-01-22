import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ScreeningEntry from './components/ScreeningEntry';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const Root = () => {
    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
    const [errors, setErrors] = useState([]);

    const saveScreening = data => {
        if (data.theater_id == '') {
            setErrors(old => [...old, 'Theater is required']);
            return;
        }
        axios
            .post('/screenings', data)
            .then(console.log('data posted'))
            .catch(console.log);
    };

    const addError = msg => e => setErrors(old => [...old, msg + e.message]);

    useEffect(() => {
        axios
            .get('/theaters/json')
            .then(result => setTheaters(result.data))
            .catch(addError('Theaters could not be loaded: '));
    }, []);

    useEffect(() => {
        axios
            .get('/films/json')
            .then(result => setFilms(result.data))
            .catch(addError('Films could not be loaded: '));
    }, []);

    return (
        <>
            {errors.map(e => (
                <p className="err-msg" key={e}>
                    {e}
                </p>
            ))}
            <ScreeningEntry
                theaters={theaters}
                saveScreening={saveScreening}
                date={'1999-12-12'}
                films={films}
            />
        </>
    );
};

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);
