import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theatersToReview } from './backend-helpers/mock-backend-data';
import { TheaterReview } from '../pages/ReviewActivity';
import '@testing-library/jest-dom/extend-expect';

describe('Theater Review', () => {
    beforeEach(() => render(<TheaterReview />));

    it('should display a list of theaters to review', async () => {
        expect(await screen.findByText(theatersToReview[0].current.name)).toBeInTheDocument();
    });

    it('should display a sublist of alternate names for each theater, where available', async () => {
        expect(await screen.findByText(theatersToReview[0].alternates[0].name)).toBeInTheDocument();
    });
});
