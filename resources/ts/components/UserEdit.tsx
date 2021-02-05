import React, { ReactElement, useState } from 'react';
import { User } from '../types/api';
import Autosuggest from './Autosuggest';
import { useAdminContext } from '../contexts/AdminContext';

const UserEdit = (): ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    const { users } = useAdminContext();

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

    if (!user && !isNewUser) {
        return (
            <Autosuggest
                config={suggestUsersConfig}
                handleSubmit={handleSelect}
                handleManualAdd={() => setIsNewUser(true)}
            />
        );
    }

    return <div></div>;
};

export default UserEdit;
