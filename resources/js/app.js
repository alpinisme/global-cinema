import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ScreeningEntry from './components/ScreeningEntry';
import ErrorBox from './components/ErrorBox';
import Screening from './components/Screening';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const Root = () => {
    const [theaters, setTheaters] = useState([]);
    const [films, setFilms] = useState([]);
    const [errors, setErrors] = useState([]);
    const [screenings, setScreenings] = useState([]);
    const date = '1999-12-12';

    const deleteFromDB = (id, index) => {
        axios
            .delete(`/screenings/${id}`)
            .then(() =>
                setScreenings(old => [
                    ...old.slice(0, index),
                    ...old.slice(index + 1)
                ])
            )
            .then(console.log('successful delete'))
            .catch(console.log);
    };

    useEffect(() => {
        axios
            .get('/theaters/json')
            .then(res => res.data)
            .then(setTheaters)
            .catch(e =>
                setErrors(old => [`Theaters could not be loaded: ${e}`, ...old])
            );
    }, []);

    useEffect(() => {
        axios
            .get('/films/json')
            .then(res => res.data)
            .then(setFilms)
            .catch(e =>
                setErrors(old => [`Films could not be loaded: ${e}`, ...old])
            );
    }, []);

    useEffect(() => {
        axios
            .get('/screenings', { headers: { Accept: 'application/json' } })
            .then(res => res.data)
            .then(setScreenings)
            .catch(console.log);
    }, [films]);

    return (
        <>
            <div>
                <h2>Save new screening</h2>

                <ErrorBox errors={errors} />

                <ScreeningEntry
                    theaters={theaters}
                    films={films}
                    date={date}
                    addFilm={film => setFilms(old => [film, ...old])}
                    handleSuccess={data => setScreenings(old => [data, ...old])}
                />
            </div>

            <div>
                <h2>Already Saved</h2>
                {screenings.reverse().map((data, index) => (
                    <Screening
                        key={data.id}
                        data={{ screening: data, films, theaters }}
                        handleDelete={() => deleteFromDB(data.id, index)}
                    />
                ))}
            </div>
        </>
    );
};

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);
