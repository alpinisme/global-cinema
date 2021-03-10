import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';

const NotFound = (): ReactElement => {
    const history = useHistory();
    return (
        <>
            <div>Sorry. Page not found.</div>
            <button onClick={() => history.goBack()}>Go back</button>
        </>
    );
};

export default NotFound;
