import React, { ReactElement, useContext } from 'react';
import { User } from '../../types/api';
import Autosuggest from '../Autosuggest';
import Clipboard from '../Clipboard';
import { usePostRequest } from '../../hooks/requestHooks';
import { AdminContext } from '../../contexts/AdminContext';
import styles from './PasswordReset.scss';

// TODO: allow more than one password reset (add action to button)

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
                <button className={styles.reset}>reset another password?</button>
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
