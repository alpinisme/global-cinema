import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import type { Film, Theater /* User */ } from '../types/apiInterfaces';
import Month from '../components/Month';
import MonthPicker from '../components/MonthPicker';

/*
start page: "what would you like to do?"
give list of options, with a state variable "active" set to whichever action is clicked on (unset when double clicked)
the action will open a segment of html below it. 

actions:
add/edit user privileges
reset password
enter data

*/

const AdminPage = ({ setErrors }: Props): ReactElement => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [films, setFilms] = useState<Film[]>([]);
    const [month, setMonth] = useState<string | null>(null);
    //const [users, setUsers] = useState<User[]>([]);

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

    // /**
    //  * loads users from api
    //  */
    // useEffect(() => {
    //     axios
    //         .get('/users')
    //         .then(res => res.data)
    //         .then(setUsers)
    //         .catch(e => setErrors(`Users could not be loaded: ${e}`));
    // }, []);

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
