import axios from 'axios';
import React, { ReactElement, useEffect, useState } from 'react';
import DuplicatesDisplay from '../../components/DuplicatesDisplay';
import { Film, FilmToReview, Theater, TheaterToReview, User } from '../../types/api';
import { useGetRequest, usePatchRequest } from '../../utils/hooks';
import styles from './ActivityReview.scss';

const UserReview = (): ReactElement => {
    const url = '/review/users';
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        let isMounted = true;

        axios
            .get(url)
            .then(res => isMounted && setUsers(res.data))
            .catch(err => console.log('Oops', err));

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Removes the specified user from list of items in state
     * @param id id of user to remove
     */
    const removeUser = (id: number) =>
        setUsers(users => {
            if (!users) throw new Error('tried to remove non-existent user in UserReview');
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

    if (!users) {
        return <div>...loading</div>; // TODO: Create loading compontent
    }

    return (
        <table>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>
                            <button onClick={() => approve(user.id)}>approve</button>
                        </td>
                        <td>
                            <button onClick={() => reject(user.id)}>reject</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const TheaterReview = (): ReactElement => {
    const url = '/review/theaters';
    const theaters = useGetRequest<TheaterToReview[]>(url);

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

    if (theaters.data) {
        return (
            <ul>
                {theaters.data.map(theater => (
                    <li key={theater.current.id}>
                        {theater.current.name}
                        <button onClick={() => approve(theater.current)}>Approve</button>
                        <button onClick={() => reject(theater.current)}>Reject</button>
                        <DuplicatesDisplay
                            duplicates={theater.alternates}
                            displayAlternate={theater => theater.name}
                            handleMerge={alternate => merge(theater.current, alternate)}
                        />
                    </li>
                ))}
            </ul>
        );
    }

    return <div>loading</div>;
};

const FilmReview = () => {
    const url = '/review/films';
    const [films, setFilms] = useState<FilmToReview[]>([]);
    const [mergeResult, sendMergeRequest] = usePatchRequest();
    const minCount = 5;

    useEffect(() => {
        if (mergeResult.error) {
            console.log(mergeResult);
        }
    }, [mergeResult]);

    useEffect(() => {
        let isMounted = true;
        console.log('inside useeffect');

        if (films.length == 0 || films.length == minCount) {
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

    if (!films) {
        return <div>...searching the database</div>;
    }

    return (
        <ul>
            {films.map(film => (
                <li className={styles.item} key={film.current.id}>
                    <em className={styles.current}>
                        {film.current.title} ({film.current.year ?? 'no year'})
                    </em>
                    <button className={styles.reject} onClick={() => reject(film.current)}>
                        Reject
                    </button>
                    <DuplicatesDisplay
                        duplicates={film.alternates}
                        displayAlternate={film => `${film.title} (${film.year})`}
                        displayTitle={film => film.imdb}
                        handleMerge={alternate => merge(film.current, alternate)}
                    />
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
