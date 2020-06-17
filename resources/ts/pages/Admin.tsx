import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Film, Theater, User } from '../types/api';
import Month from '../components/Month';
import MonthPicker from '../components/MonthPicker';

type Action = 'edit users' | 'reset password' | 'enter screenings';

const AdminPage = ({ useGetRequest }: Props): ReactElement => {
    const [month, setMonth] = useState<string | null>(null);
    const [action, setAction] = useState<Action | null>(null);

    const [films, setFilms] = useGetRequest<Film[]>(
        '/films',
        e => `Films could not be loaded: ${e}`
    );

    const [theaters] = useGetRequest<Theater[]>(
        '/theaters',
        e => `Theaters could not be loaded: ${e}`
    );

    const [users] = useGetRequest<User[]>(
        '/users',
        e => `Users could not be loaded: ${e}`
    );

    /**
     * add film to list of films in state
     * if that list is null, create it with new film as only member
     * (such a state should be impossible, though)
     * @param film Film
     */
    const addFilm = (film: Film) =>
        setFilms(old => (old ? [film, ...old] : [film]));

    console.log(action);

    return month ? (
        <Month
            month={month}
            films={films ?? ([] as Film[])}
            theaters={theaters ?? ([] as Theater[])}
            addFilm={addFilm}
            cancel={() => setMonth(null)}
        />
    ) : (
        <>
            <p>What would you like to do?</p>

            <ul>
                <li onClick={() => setAction('edit users')}>
                    edit users
                    {users && action == 'edit users' && <div>here you go</div>}
                </li>
                <li onClick={() => setAction('enter screenings')}>
                    enter screenings
                    {!month && action == 'enter screenings' && (
                        <MonthPicker setMonth={setMonth} />
                    )}
                </li>
            </ul>
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
