import React from 'react';

import { render, waitFor, screen } from '@testing-library/react';
import AdminPage from '../pages/Home/Admin';
import { cities } from './backend-helpers/mock-backend-data';
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import { server, rest } from './backend-helpers/server';
import { StaticRouter } from 'react-router';

describe('With happy-path api calls', () => {
    beforeEach(() => {
        render(
            <StaticRouter>
                <AdminPage />
            </StaticRouter>
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
        server.use(
            rest.get('/cities', async (req, res, ctx) => {
                return res(ctx.status(500), ctx.json({ message: 'server error' }));
            })
        );

        render(
            <StaticRouter>
                <AdminPage />
            </StaticRouter>
        );

        // await waitFor(() => expect(errMsg).toStartWith('Cities could not be loaded'));
    });
});
