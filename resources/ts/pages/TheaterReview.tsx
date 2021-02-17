import React, { ReactElement } from 'react';
import DuplicatesDisplay from '../components/DuplicatesDisplay';
import ItemToReview from '../components/ItemToReview';
import LoadingIndicator from '../components/LoadingIndicator';
import TextButton from '../components/TextButton';
import { Theater, TheaterToReview } from '../types/api';
import { useGetRequest } from '../hooks/requestHooks';

const TheaterReview = (): ReactElement => {
    const url = '/review/theaters';
    const theaters = useGetRequest<TheaterToReview[]>(url);

    const approve = (theater: Theater) => {
        console.log('approved', theater);
    };

    const reject = (theater: Theater) => {
        console.log('rejected', theater);
    };

    const merge = (wrong: Theater, correct: Theater) => {
        console.log('merged', wrong, correct);
    };

    if (theaters.data) {
        return (
            <ul>
                {theaters.data.map(theater => (
                    <ItemToReview key={theater.current.id} name={theater.current.name}>
                        <TextButton label="Approve" handleClick={() => approve(theater.current)} />
                        <TextButton
                            label="Reject"
                            style="danger"
                            handleClick={() => reject(theater.current)}
                        />
                        <DuplicatesDisplay
                            duplicates={theater.alternates}
                            displayAlternate={theater => theater.name}
                            handleMerge={alternate => merge(theater.current, alternate)}
                        />
                    </ItemToReview>
                ))}
            </ul>
        );
    }

    return <LoadingIndicator />;
};

export default TheaterReview;
