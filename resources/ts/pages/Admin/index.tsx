import React, { useState, ReactElement, Dispatch, SetStateAction } from 'react';
import Month from '../../components/Month';
import Collapsible from '../../components/Collapsible';
import styles from './Admin.scss';
import UserEdit from '../../components/UserEdit';
import PasswordReset from '../../components/PasswordReset';
import ScreeningEntryPortal from '../../components/ScreeningEntryPortal';
import AdminProvider from '../../contexts/AdminContext';
import ScreeningsProvider from '../../contexts/ScreeningsContext';
import ActivityReview from '../ActivityReview';
import ProgressChecker from '../ProgressChecker/ index';
import CsvUploader from '../CsvUploader';

type Action =
    | 'edit users'
    | 'password reset'
    | 'enter screenings'
    | 'review activity'
    | 'check progress'
    | 'upload a csv';

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
const AdminPage = (): ReactElement => {
    const [month, setMonth] = useState<string | null>(null);
    const [action, setAction] = useState<Action | null>(null);

    /**
     * checks if the clicked on collapsible is already open
     * @param el Action assigned to the collapsible element
     */
    const isOpen = (el: Action) => el == action;

    if (month) {
        return (
            <ScreeningsProvider>
                <Month month={month} cancel={() => setMonth(null)} />
            </ScreeningsProvider>
        );
    }

    return (
        <AdminProvider>
            <h2 className={styles.h2}>What would you like to do?</h2>

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
                        open={isOpen('review activity')}
                        handleClick={() => handleClick(setAction, 'review activity')}
                        label="review activity"
                    >
                        <ActivityReview />
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

                <li>
                    <Collapsible
                        open={isOpen('check progress')}
                        handleClick={() => handleClick(setAction, 'check progress')}
                        label="check progress"
                    >
                        <ProgressChecker />
                    </Collapsible>
                </li>

                <li>
                    <Collapsible
                        open={isOpen('upload a csv')}
                        handleClick={() => handleClick(setAction, 'upload a csv')}
                        label="upload a csv"
                    >
                        <CsvUploader />
                    </Collapsible>
                </li>
            </ul>
        </AdminProvider>
    );
};

export default AdminPage;
