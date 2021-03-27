import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import useTitle from '../hooks/useTitle';

const NotFound = (): ReactElement => {
    const history = useHistory();
    useTitle('Not Found');

    return (
        <>
            <div>Sorry. Page not found.</div>
            <button onClick={() => history.goBack()}>Go back</button>
        </>
    );
};

export default NotFound;
