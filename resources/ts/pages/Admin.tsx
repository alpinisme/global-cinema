import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Film, Theater, User } from '../types/api';
import Month from '../components/Month';
import MonthPicker from '../components/MonthPicker';
import Autosuggest from '../components/Autosuggest';

type Action = 'edit users' | 'password reset' | 'enter screenings';

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

    /**
     * Given a `setState` function and an `Action`, this curried function
     * compares the new `Action` against the previous one, and
     * sets the state to null if they are the same (re-click)
     * or to the new `Action` if not
     *
     * @param fn react setState function
     * @param next action that is clicked on
     */
    const handleClick = (
        fn: Dispatch<SetStateAction<Action | null>>,
        next: Action
    ) => {
        const compare = (prev: Action | null) => {
            if (prev == next) {
                return null;
            }
            return next;
        };
        fn(compare);
    };

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
                <li>
                    <button
                        onClick={() => handleClick(setAction, 'edit users')}
                    >
                        edit users
                    </button>
                    {action == 'edit users' && <div>here you go</div>}
                </li>
                <li>
                    <button
                        onClick={() => handleClick(setAction, 'password reset')}
                    >
                        reset a password
                    </button>
                    {action == 'password reset' && (
                        <div>
                            here you go
                            <Autosuggest
                                label={'user'}
                                keys={['name', 'email']}
                                options={users ?? ([] as User[])}
                                displayMatch={match =>
                                    `${match.name} (${match.email})`
                                }
                                handleSubmit={id => console.log(id)}
                                handleManualAdd={name => console.log(name)}
                            />
                        </div>
                    )}
                </li>
                <li>
                    <button
                        onClick={() =>
                            handleClick(setAction, 'enter screenings')
                        }
                    >
                        enter screenings
                    </button>
                    {action == 'enter screenings' && (
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
