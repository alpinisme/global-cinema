import axios from 'axios';
import React, { ReactElement, useState } from 'react';
import { User } from '../../types/api';
import { useGetRequest } from '../../utils/hooks';

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

const ReviewActivity = (): ReactElement => {
    const [endpoint, setEndpoint] = useState('');
    return (
        <>
            <select value={endpoint} onChange={e => setEndpoint(e.target.value)}>
                <option value="">Select...</option>
                <option value="users">Users</option>
                <option value="films">Films</option>
                <option value="theaters">Theaters</option>
            </select>

            {endpoint == 'users' && <UserReview />}
            {endpoint == ''}
        </>
    );
};

export default ReviewActivity;
