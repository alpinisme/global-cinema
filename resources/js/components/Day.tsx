import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import ScreeningEntry from './ScreeningEntry';
import Screening from './Screening';
import { Screening as ScreeningInterface } from './ScreeningEntry';
import { toDateString } from '../utils/functions';
import { Film, Theater } from '../types/apiInterfaces';

export interface Props {
    date: Date;
    handleCancel: () => void;
    theaters: Theater[];
    films: Film[];
    addFilm: (film: Film) => void;
}

const Day = ({
    date,
    handleCancel,
    theaters,
    films,
    addFilm
}: Props): ReactElement => {
    const [screenings, setScreenings] = useState<ScreeningInterface[]>([]);

    /**
     * sends request to server to destroy record at `id`
     * and also removes it from current application state
     *
     * @param {number} id id to be deleted
     * @param {number} index location in state array
     */
    const destroy = (id: number, index: number) => {
        axios
            .delete(`/screenings/${id}`)
            .then(() =>
                setScreenings(old => [
                    ...old.slice(0, index),
                    ...old.slice(index + 1)
                ])
            )
            .catch(console.log);
    };

    /**
     * loads screenings from api
     */
    useEffect(() => {
        axios
            .get('/screenings/' + date.toISOString().slice(0, 10))
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

            <div className="box">
                <h2>Save new screening</h2>

                <ScreeningEntry
                    theaters={theaters}
                    films={films}
                    date={date}
                    addFilm={addFilm}
                    handleSuccess={data => setScreenings(old => [data, ...old])}
                />
            </div>

            {screenings.length > 0 && (
                <div className="box">
                    <h2>Already Saved</h2>
                    <ul className="already-saved">
                        {screenings.reverse().map((data, index) => (
                            <Screening
                                key={data.id}
                                data={{ screening: data, films, theaters }}
                                handleDelete={() => destroy(data.id, index)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Day;
