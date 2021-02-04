import React from 'react';
import { CityContextProvider } from '../contexts/CityContext';
import { render, waitFor, screen } from '@testing-library/react';
import AdminPage from '../pages/Admin';
import { cities } from './backend-helpers/mock-backend-data';
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import { server, rest } from './backend-helpers/server';

let errMsg = '';

describe('With happy-path api calls', () => {
    beforeEach(() => {
        render(
            <CityContextProvider>
                <AdminPage />
            </CityContextProvider>
        );
    });

    it('shows cities in select menu', async () => {
        await waitFor(() =>
            expect(screen.getAllByRole('option', { name: cities[0].name })[0]).toBeInTheDocument()
        );
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
                <AdminPage />
            </CityContextProvider>
        );

        // await waitFor(() => expect(errMsg).toStartWith('Cities could not be loaded'));
    });
});
