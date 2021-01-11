import React, { ReactElement, useState } from 'react';
import { useGetRequest } from '../../utils/hooks';

interface Item {
    name: string;
    id: number;
}

const ItemsToReview = ({ endpoint }: ItemsToReview): ReactElement => {
    const url = '/review/' + endpoint;
    const [items] = useGetRequest<Item[]>(url, err => console.log(err));

    const approve = (id: number) => console.log('approved: ', id);
    const reject = (id: number) => console.log('rejected: ', id);

    return (
        <table>
            {items ? (
                items.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                            <button onClick={() => approve(item.id)}>approve</button>
                        </td>
                        <td>
                            <button onClick={() => reject(item.id)}>reject</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td>...loading</td>
                </tr>
            )}
        </table>
    );
};

const ReviewActivity = (): ReactElement => {
    const [endpoint, setEndpoint] = useState('');
    return (
        <>
            <select value={endpoint} onChange={e => setEndpoint(e.target.value)}>
                <option value="">Select...</option>
                <option value="users">Users</option>
                <option value="films">Films</option>
                <option value="theaters">Theaters</option>
            </select>

            {endpoint && <ItemsToReview endpoint={endpoint} />}
        </>
    );
};

export default ReviewActivity;

interface ItemsToReview {
    endpoint: string;
}
