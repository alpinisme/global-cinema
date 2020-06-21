import React, { ReactElement, useState } from 'react';
import { User } from '../types/api';
import Autosuggest from './Autosuggest';
import { usePutRequest } from '../utils/hooks';

const UserEdit = ({ users }: Props): ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [userUpdateResult, makeUserUpdateRequest] = usePutRequest<User, string>();

    /**
     * finds and sets user in state based on given userID
     * sets to null if invalid id (which should not happen)
     * @param id userID
     */
    const handleSelect = (id: number) => setUser(users.find(u => u.id == id) ?? null);

    const suggestUsersConfig = {
        label: 'User',
        keys: ['name', 'email'],
        displayMatch: (u: User) => `${u.name} (${u.email})`,
        options: users ?? [],
    };

    if (!user) {
        return <Autosuggest config={suggestUsersConfig} handleSubmit={handleSelect} />;
    }

    return <div></div>;
};

interface Props {
    users: User[];
}

export default UserEdit;
