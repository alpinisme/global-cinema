import React, { ReactElement, useState } from 'react';
import FilmReview from './FilmReview';
import TheaterReview from './TheaterReview';
import UserReview from './UserReview';
import styles from './ActivityReview.scss';

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
