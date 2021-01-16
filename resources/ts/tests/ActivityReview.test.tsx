import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theatersToReview } from './backend-helpers/mock-backend-data';
import { TheaterReview } from '../pages/ActivityReview';
import '@testing-library/jest-dom/extend-expect';
import { rest, server } from './backend-helpers/server';

describe('Theater Review', () => {
    it('should display a list of theaters to review', async () => {
        render(<TheaterReview />);
        expect(await screen.findByText(theatersToReview[0].current.name)).toBeInTheDocument();
    });

    it('should display a sublist of alternate names for each theater, where available', async () => {
        render(<TheaterReview />);
        expect(await screen.findByText('Possibly a duplicate of:')).toBeInTheDocument();
        expect(await screen.findByText(theatersToReview[0].alternates[0].name)).toBeInTheDocument();
        expect(screen.queryByText('No likely duplicates found')).not.toBeInTheDocument();
    });

    it('should say when there are no likely duplicates', async () => {
        const response = [{ current: { name: 'x', id: 1 }, alternates: [] }];
        server.use(
            rest.get('/review/theaters', async (req, res, ctx) => {
                return res(ctx.json(response));
            })
        );
        render(<TheaterReview />);
        expect(await screen.findByText('No likely duplicates found')).toBeInTheDocument();
        expect(screen.queryByText('Possibly a duplicate of:')).not.toBeInTheDocument();
    });
});
