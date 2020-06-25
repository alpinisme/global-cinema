import React, { ReactElement, useContext } from 'react';
import { User } from '../types/api';
import Autosuggest from './Autosuggest';
import Clipboard from './Clipboard';
import { usePostRequest } from '../utils/hooks';
import AdminContext from '../contexts/AdminContext';

const PasswordReset = (): ReactElement => {
    const [passResetResult, makePassResetRequest] = usePostRequest<string, string>();
    const { users } = useContext(AdminContext);

    const suggestUsersConfig = {
        label: 'User',
        keys: ['name', 'email'],
        displayMatch: (u: User) => `${u.name} (${u.email})`,
        options: users ?? [],
    };

    if (passResetResult.data) {
        return (
            <>
                Reset link:
                <Clipboard content={passResetResult.data} />
            </>
        );
    }

    return (
        <Autosuggest
            config={suggestUsersConfig}
            handleSubmit={id => makePassResetRequest(`/password/reset/${id}`, '')}
        />
    );
};

export default PasswordReset;
