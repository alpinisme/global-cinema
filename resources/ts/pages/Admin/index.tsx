import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Film, Theater, User, City } from '../../types/api';
import Month from '../../components/Month';
import Collapsible from '../../components/Collapsible';
import styles from './Admin.scss';
import UserEdit from '../../components/UserEdit';
import PasswordReset from '../../components/PasswordReset';
import ScreeningEntryPortal from '../../components/ScreeningEntryPortal';
import AdminContext, { AdminContextData } from '../../contexts/AdminContext';
import ScreeningsContext, { ScreeningsContextData } from '../../contexts/ScreeningsContext';

type Action = 'edit users' | 'password reset' | 'enter screenings';

/**
 * Given a `setState` function and an `Action`, this curried function
 * compares the new `Action` against the previous one, and
 * sets the state to null if they are the same (re-click)
 * or to the new `Action` if not
 *
 * @param fn react setState function
 * @param next action that is clicked on
 */
const handleClick = (fn: Dispatch<SetStateAction<Action | null>>, next: Action) => {
    const compare = (prev: Action | null) => {
        if (prev == next) {
            return null;
        }
        return next;
    };
    fn(compare);
};

/**
 * Homepage for admin users, where they can alter user privileges,
 * manually reset passwords, and input data for any city and date they like.
 */
const AdminPage = ({ useGetRequest }: Props): ReactElement => {
    const [month, setMonth] = useState<string | null>(null);
    const [action, setAction] = useState<Action | null>(null);

    const [users] = useGetRequest<User[]>('/users', e => `Users could not be loaded: ${e}`);

    const [films, setFilms] = useGetRequest<Film[]>(
        '/films',
        e => `Films could not be loaded: ${e}`
    );

    const [theaters] = useGetRequest<Theater[]>(
        '/theaters',
        e => `Theaters could not be loaded: ${e}`
    );

    const [cities] = useGetRequest<City[]>('/cities', e => `Cities could not be loaded: ${e}`);

    /**
     * add film to list of films in state;
     * if that list is null, create it with new film as only member
     * (such a state should be impossible, though)
     * @param film Film
     */
    const addFilm = (film: Film) => setFilms(old => (old ? [film, ...old] : [film]));

    /**
     * checks if the clicked on collapsible is already open
     * @param el Action assigned to the collapsible element
     */
    const isOpen = (el: Action) => el == action;

    const adminContextData = {
        users: users ?? [],
        cities: cities ?? [],
    };

    const screeningsContextData = {
        films: films ?? [],
        theaters: theaters ?? [],
        addFilm,
    };

    if (month) {
        return (
            <ScreeningsContext.Provider value={screeningsContextData}>
                <Month month={month} cancel={() => setMonth(null)} />
            </ScreeningsContext.Provider>
        );
    }

    return (
        <AdminContext.Provider value={adminContextData}>
            <h2>What would you like to do?</h2>

            <ul className={styles.list}>
                <li>
                    <Collapsible
                        open={isOpen('edit users')}
                        handleClick={() => handleClick(setAction, 'edit users')}
                        label="edit users"
                    >
                        <UserEdit />
                    </Collapsible>
                </li>

                <li>
                    <Collapsible
                        open={isOpen('password reset')}
                        handleClick={() => handleClick(setAction, 'password reset')}
                        label="password reset"
                    >
                        <PasswordReset />
                    </Collapsible>
                </li>

                <li>
                    <Collapsible
                        open={isOpen('enter screenings')}
                        handleClick={() => handleClick(setAction, 'enter screenings')}
                        label="enter screenings"
                    >
                        <ScreeningEntryPortal setMonth={setMonth} />
                    </Collapsible>
                </li>
            </ul>
        </AdminContext.Provider>
    );
};

export interface Props {
    useGetRequest: <A>(
        url: string,
        createErrMsg: (e: string) => string
    ) => [A | null, Dispatch<SetStateAction<A | null>>];
}

export default AdminPage;
