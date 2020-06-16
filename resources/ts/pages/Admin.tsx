import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Film, Theater, User } from '../types/api';
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

const AdminPage = ({ useGetRequest }: Props): ReactElement => {
    // const [theaters, setTheaters] = useState<Theater[]>([]);
    // const [films, setFilms] = useState<Film[]>([]);
    const [month, setMonth] = useState<string | null>(null);
    // const [users, setUsers] = useState<User[]>([]);

    // const get = useCallback((a, b, c) => props.get(a, b, c), [props]);

    const [theaters] = useGetRequest(
        '/theaters',
        e => `Theaters could not be loaded: ${e}`
    );

    const [films, setFilms] = useGetRequest(
        '/films',
        e => `Films could not be loaded: ${e}`
    );

    const [users] = useGetRequest(
        '/users',
        e => `Users could not be loaded: ${e}`
    );

    // /**
    //  * loads theaters from api
    //  */
    // useEffect(() => {
    //     const createErrMsg = e => `Theaters could not be loaded: ${e}`;
    //     get('/theaters', setTheaters, createErrMsg);
    // }, []);

    // /**
    //  * loads films from api
    //  */
    // useEffect(() => {
    //     const createErrMsg = e => `Films could not be loaded: ${e}`;
    //     get('/films', setFilms, createErrMsg);
    // }, []);

    // /**
    //  * loads users from api
    //  */
    // useEffect(() => {
    //     const createErrMsg = e => `Users could not be loaded: ${e}`;
    //     get('/users', setUsers, createErrMsg);
    // }, []);

    return (
        <>
            {month ? (
                <Month
                    month={month}
                    films={(films as Film[]) ?? []}
                    theaters={(theaters as Theater[]) ?? []}
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
    useGetRequest: <A>(
        url: string,
        createErrMsg: (e: string) => string
    ) => [A | null, Dispatch<SetStateAction<A | null>>];
}

export default AdminPage;
