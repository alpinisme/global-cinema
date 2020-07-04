import React from 'react';
import { CityContextProvider } from '../contexts/CityContext';
import { render, waitFor, screen } from '@testing-library/react';
import AdminPage from '../pages/Admin';
import { useGetRequest } from '../utils/hooks';
import { cities } from './backend-helpers/mock-backend-data';
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import { server, rest } from './backend-helpers/server';

let errMsg = '';

function useGetOrFail<A>(a: string, fn: (s: string) => string) {
    return useGetRequest<A>(a, b => {
        errMsg = fn(b);
    });
}

describe('With happy-path api calls', () => {
    beforeEach(() => {
        render(
            <CityContextProvider>
                <AdminPage useGetRequest={useGetOrFail} />
            </CityContextProvider>
        );

        errMsg = '';
    });
    it('shows cities in select menu', async () => {
        await waitFor(() => expect(screen.getByText(cities[0].name)).toBeInTheDocument());
    });
});

describe('With problematic api calls', () => {
    it('handles failure gracefully', async () => {
        errMsg = '';

        server.use(
            rest.get('/cities', async (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ message: 'server error' }));
            })
        );

        render(
            <CityContextProvider>
                <AdminPage useGetRequest={useGetOrFail} />
            </CityContextProvider>
        );

        await waitFor(() => expect(errMsg).toStartWith('Cities could not be loaded'));
    });
});
