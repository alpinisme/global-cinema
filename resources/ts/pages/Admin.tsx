import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Film, Theater, User } from '../types/api';
import Month from '../components/Month';
import MonthPicker from '../components/MonthPicker';
import Autosuggest from '../components/Autosuggest';
import { usePostRequest } from '../utils/hooks';
import Clipboard from '../components/Clipboard';
import styles from './Admin.scss';
import Collapsible from '../components/Collapsible';

type Action = 'edit users' | 'password reset' | 'enter screenings';

const AdminPage = ({ useGetRequest }: Props): ReactElement => {
    const [month, setMonth] = useState<string | null>(null);
    const [action, setAction] = useState<Action | null>(null);
    const [result, makePostRequest] = usePostRequest<string, string>();

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
     * add film to list of films in state;
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

    const isOpen = (el: Action) => el == action;

    const toggleActive = (content: Action) =>
        action == content
            ? `${styles.content} ${styles.active}`
            : styles.content;

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

            <ul className={styles.list}>
                <li>
                    <Collapsible
                        open={isOpen('edit users')}
                        handleClick={() => handleClick(setAction, 'edit users')}
                        buttonLabel="edit users"
                    >
                        <>hear you go</>
                    </Collapsible>
                </li>
                <li>
                    <Collapsible
                        open={isOpen('password reset')}
                        handleClick={() =>
                            handleClick(setAction, 'password reset')
                        }
                        buttonLabel="edit users"
                    >
                        {!result.data ? (
                            <Autosuggest
                                label={'user'}
                                keys={['name', 'email']}
                                options={users ?? []}
                                displayMatch={match =>
                                    `${match.name} (${match.email})`
                                }
                                handleSubmit={id =>
                                    makePostRequest(`/password/reset/${id}`, '')
                                }
                                handleManualAdd={name => console.log(name)}
                            />
                        ) : (
                            <div>
                                Reset link:
                                <Clipboard content={result.data} />
                            </div>
                        )}
                    </Collapsible>
                </li>
                <li>
                    <Collapsible
                        open={isOpen('enter screenings')}
                        handleClick={() => setAction('enter screenings')}
                        buttonLabel="enter screenings"
                    >
                        <MonthPicker setMonth={setMonth} />
                    </Collapsible>
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
