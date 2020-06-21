import React, { ReactElement } from 'react';
import { User } from '../types/api';
import Autosuggest from './Autosuggest';
import Clipboard from './Clipboard';
import { usePostRequest } from '../utils/hooks';

const PasswordReset = ({ users }: Props): ReactElement => {
    const [passResetResult, makePassResetRequest] = usePostRequest<string, string>();

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

interface Props {
    users: User[];
}

export default PasswordReset;
