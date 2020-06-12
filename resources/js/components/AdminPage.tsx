import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';

const AdminPage = ({ setErrors }: Props): ReactElement => {
    /**
     * get student's assignment from api
     */
    useEffect(() => {
        axios
            .get('/assignment')
            .then(res => res.data)
            .catch(console.log);
    }, []);

    return <div>admin page</div>;
};

export interface Props {
    setErrors: (e: string) => undefined;
}

export default AdminPage;
