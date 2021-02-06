import axios from 'axios';
import React, { ReactElement, useEffect, useState } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import { User } from '../types/api';

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
        return <LoadingIndicator />; // TODO: Create loading compontent
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

export default UserReview;
