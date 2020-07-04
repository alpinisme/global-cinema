import React from 'react';
import { CityContextProvider } from '../contexts/CityContext';
import { cities } from './backend-helpers/mock-backend-data';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { value } from './test-utils';
import ScreeningEntryPortal from '../components/ScreeningEntryPortal';
import AdminContext from '../contexts/AdminContext';

/*
    This file tests the Screening Entry Portal component, but it does so from
    the context of the Admin component to 
*/

const city = cities[0];

describe('With valid context provider', () => {
    beforeEach(() =>
        render(
            <CityContextProvider>
                <AdminContext.Provider value={{ cities, users: [] }}>
                    <ScreeningEntryPortal setMonth={console.log} />
                </AdminContext.Provider>
            </CityContextProvider>
        )
    );

    it('shows cities in select menu', async () => {
        await waitFor(() => expect(screen.getByText(city.name)).toBeInTheDocument());
    });

    it('should not display an input for the month before a city is selected', () => {
        expect(screen.queryByLabelText('Choose a Month:')).toBeNull();
    });

    it('should display an input for the month only after city is selected', async () => {
        await waitFor(() => screen.getByText(city.name));

        const select = screen.getByLabelText('Choose a city:') as HTMLSelectElement;
        fireEvent.change(select, value(city.id));

        expect(select.value).toBe(city.id.toString());
        expect(screen.getByLabelText('Choose a month:')).toBeInTheDocument();
    });

    it('should complain if the user submits an invalid month', async () => {
        await waitFor(() => screen.getByText(city.name));

        const select = screen.getByLabelText('Choose a city:') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: city.id } });

        fireEvent.change(screen.getByLabelText('Choose a month:'), value('09/2040'));
        fireEvent.submit(screen.getByText('Submit'));

        expect(screen.getByText('Month must be from the past')).toBeInTheDocument();
    });
});
