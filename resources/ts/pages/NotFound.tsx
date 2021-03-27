import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import ContentContainer from '../components/ContentContainer';
import useTitle from '../hooks/useTitle';

const NotFound = (): ReactElement => {
    const history = useHistory();
    useTitle('Not Found');

    return (
        <ContentContainer>
            <div>Sorry. Page not found.</div>
            <button onClick={() => history.goBack()}>Go back</button>
        </ContentContainer>
    );
};

export default NotFound;
