/*

Things to test:
1. That you can add a film and it will show up in Saved Screenings.
2. That you can delete a film in Saved Screenings.
3. That you Saved Screenings show up in a consistent order.
4. That you can delete Saved Screenings that were already there.
5. That you can delete Saved Screenings that are new.
6. That you can add screenings and they will appear at the top of Saved Screenings.
7. That you can delete a screening from the middle of Saved Screenings.
8. That you can delete a screening from the end of Saved Screenings.'
9. When you delete something the right entry is deleted.

*/

import React from 'react';
import AdminPage from '../pages/Admin';
import { useGetRequest } from '../utils/hooks';
import { CityContextProvider } from '../contexts/CityContext';
import { cities } from './backend-helpers/mock-backend-data';
import Axios from 'axios';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('msw works', async () => {
    const result = await Axios.get('/cities');
    expect(JSON.parse(result.request.response)).toContainEqual(cities[0]);
});

it('show cities in select menu', async () => {
    function useGetOrFail<A>(a: string, fn: (s: string) => string) {
        return useGetRequest<A>(a, b => console.log(fn(b)));
    }

    render(
        <CityContextProvider>
            <AdminPage useGetRequest={useGetOrFail} />
        </CityContextProvider>
    );

    await waitFor(() => expect(screen.getByText('Seattle')).toBeInTheDocument());
    expect(1).toBe(1);
});
