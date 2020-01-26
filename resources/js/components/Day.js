import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ScreeningEntry from './ScreeningEntry';
import Screening from './Screening';
import { toDateString } from './DaySelector';

const Day = ({
    date,
    handleCancel,
    handleSubmission,
    theaters,
    films,
    addFilm
}) => {
    const [screenings, setScreenings] = useState([]);

    /**
     * sends request to server to destroy record at `id`
     * and also removes it from current application state
     *
     * @param {number} id id to be deleted
     * @param {number} index location in state array
     */
    const destroy = (id, index) => {
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

    /**
     * loads screenings from api
     *
     * TODO: make this only load screenings for one day
     */
    useEffect(() => {
        axios
            .get('/screenings')
            .then(res => res.data)
            .then(setScreenings)
            .catch(console.log);
    }, [films]);

    return (
        <>
            <h1>{toDateString(date)}</h1>

            <button className="cancel-btn" onClick={handleCancel}>
                Back to all dates
            </button>

            <div>
                <h2>Save new screening</h2>

                <ScreeningEntry
                    theaters={theaters}
                    films={films}
                    date={date}
                    addFilm={addFilm}
                    handleSuccess={data => setScreenings(old => [data, ...old])}
                />
            </div>

            <button onClick={handleSubmission}>Mark day complete</button>

            <div>
                <h2>Already Saved</h2>
                <ul>
                    {screenings.reverse().map((data, index) => (
                        <Screening
                            key={data.id}
                            data={{ screening: data, films, theaters }}
                            handleDelete={() => destroy(data.id, index)}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
};

Day.propTypes = {
    date: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmission: PropTypes.func.isRequired,
    films: PropTypes.array.isRequired,
    theaters: PropTypes.array.isRequired,
    addFilm: PropTypes.func.isRequired
};

export default Day;
