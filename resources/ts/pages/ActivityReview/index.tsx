import axios from 'axios';
import React, { ReactElement, useEffect, useState } from 'react';
import { Film, FilmToReview, Theater, TheaterToReview, User } from '../../types/api';
import { useGetRequest, usePatchRequest } from '../../utils/hooks';
import styles from './ActivityReview.scss';

const UserReview = (): ReactElement => {
    const url = '/review/users';
    const [users, setUsers] = useGetRequest<User[]>(url, err => console.log(err));

    /**
     * Removes the specified user from list of items in state
     * @param id id of user to remove
     */
    const removeUser = (id: number) =>
        setUsers(users => {
            if (!users) throw new Error('tried to remove non-existent user in ItemsToReview');
            const index = users.findIndex(user => user.id == id);
            return [...users.slice(0, index), ...users.slice(index + 1)];
        });

    /**
     * Sends PUT request to server to update user role, removing the 'unconfirmed_' prefix
     * also removes user from state
     * @param id id of user to approve
     */
    const approve = (id: number) => {
        const user = users?.find(user => user.id == id);
        const oldRole = user?.role;
        const newRole = oldRole?.slice('unconfirmed_'.length);

        axios
            .put(`users/${id}`, { role: newRole })
            .then(() => removeUser(id))
            .catch(err => console.log(err));
    };

    const reject = (id: number) => {
        axios.delete(`users/${id}`);
        removeUser(id);
    };

    return (
        <table>
            <tbody>
                {users ? (
                    users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>
                                <button onClick={() => approve(user.id)}>approve</button>
                            </td>
                            <td>
                                <button onClick={() => reject(user.id)}>reject</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td>...loading</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export const TheaterReview = (): ReactElement => {
    const url = '/review/theaters';
    const [theaters, setTheaters] = useGetRequest<TheaterToReview[]>(url, err => console.log(err));

    const approve = (theater: Theater) => {
        console.log('approved', theater);
        0;
    };

    const reject = (theater: Theater) => {
        console.log('rejected', theater);
        0;
    };

    const merge = (wrong: Theater, correct: Theater) => {
        console.log('merged', wrong, correct);
    };

    if (theaters) {
        return (
            <ul>
                {theaters?.map(theater => (
                    <li key={theater.current.id}>
                        {theater.current.name}
                        <button onClick={() => approve(theater.current)}>Approve</button>
                        <button onClick={() => reject(theater.current)}>Reject</button>
                        {theater.alternates.length ? (
                            <div>
                                Possibly a duplicate of:
                                <ul>
                                    {theater.alternates.map(alternate => (
                                        <li key={alternate.id}>
                                            <button
                                                onClick={() => merge(theater.current, alternate)}
                                            ></button>
                                            {alternate.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div>No likely duplicates found</div>
                        )}
                    </li>
                ))}
            </ul>
        );
    }

    return <div>loading</div>;
};

const FilmReview = () => {
    const url = '/review/films';
    const [films, setFilms] = useGetRequest<FilmToReview[]>(url, err => console.log(err));
    const [mergeResult, sendMergeRequest] = usePatchRequest();
    const minCount = 5;

    useEffect(() => {
        if (mergeResult.error) {
            console.log(mergeResult);
        }
    }, [mergeResult]);

    useEffect(() => {
        let isMounted = true;

        if (films?.length == minCount) {
            axios
                .get(url)
                .then(res => isMounted && setFilms(res.data))
                .catch(err => console.log('Oops', err));
        }

        return () => {
            isMounted = false;
        };
    }, [films, setFilms]);

    const reject = (rejected: Film) => {
        axios.delete('films/' + rejected.id);
        setFilms(films?.filter(film => film.current != rejected) ?? []);
    };

    const merge = (from: Film, to: Film) => {
        const path = 'merge/films';
        sendMergeRequest(path, { from: from.id, to: to.id });
        setFilms(films?.filter(film => film.current != from) ?? []);
    };

    return (
        <ul>
            {!films && '...searching the database'}
            {films?.map(film => (
                <li className={styles.item} key={film.current.id}>
                    <em className={styles.current}>
                        {film.current.title} ({film.current.year ?? 'no year'})
                    </em>
                    <button className={styles.reject} onClick={() => reject(film.current)}>
                        Reject
                    </button>
                    {film.alternates.length ? (
                        <div>
                            Possibly a duplicate of:
                            <ul>
                                {film.alternates.map(alternate => (
                                    <li key={alternate.id} title={alternate.imdb}>
                                        {alternate.title} ({alternate.year})
                                        <button
                                            className={styles.merge}
                                            onClick={() => merge(film.current, alternate)}
                                        >
                                            Merge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>No likely duplicates found</div>
                    )}
                </li>
            ))}
        </ul>
    );
};

const ActivityReview = (): ReactElement => {
    const [endpoint, setEndpoint] = useState('');
    return (
        <div className={styles.review}>
            <select value={endpoint} onChange={e => setEndpoint(e.target.value)}>
                <option value="">Select...</option>
                <option value="users">Users</option>
                <option value="films">Films</option>
                <option value="theaters">Theaters</option>
            </select>

            {endpoint == 'users' && <UserReview />}
            {endpoint == 'theaters' && <TheaterReview />}
            {endpoint == 'films' && <FilmReview />}
        </div>
    );
};

export default ActivityReview;
