import axios from 'axios';
import React, { ReactElement } from 'react';
import ErrorBox from '../components/ErrorBox';
import LoadingIndicator from '../components/LoadingIndicator';
import { useGetRequest } from '../hooks/requestHooks';
import { User } from '../types/api';
import { removeFrom } from '../utils/functions';

const UserReview = (): ReactElement => {
    const url = '/review/users';
    const users = useGetRequest<User[]>(url);

    if (users.isLoading) {
        return <LoadingIndicator />;
    }

    if (users.error != null) {
        return <ErrorBox errors={users.error} />;
    }

    /**
     * Removes the specified user from list of items in state
     *
     * @param id id of user to remove
     */
    const removeUser = (id: number) =>
        users.update(oldUsers => {
            const index = oldUsers.findIndex(user => user.id == id);
            return removeFrom(oldUsers, index);
        });

    /**
     * Sends PUT request to server to update user role, removing the 'unconfirmed_' prefix
     * also removes user from state
     * @param id id of user to approve
     */
    const approve = (id: number) => {
        const user = users.data.find(user => user.id == id);
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
                {users.data.map(user => (
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
