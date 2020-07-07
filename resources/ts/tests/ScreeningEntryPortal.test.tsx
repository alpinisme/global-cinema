import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import { CityContextProvider } from '../contexts/CityContext';
import ScreeningEntryPortal from '../components/ScreeningEntryPortal';
import AdminContext from '../contexts/AdminContext';
import { cities } from './backend-helpers/mock-backend-data';

const city = cities[0];

describe('With valid context provider, ScreeningEntryPortal', () => {
    beforeEach(() =>
        render(
            <CityContextProvider>
                <AdminContext.Provider value={{ cities, users: [] }}>
                    <ScreeningEntryPortal setMonth={console.log} />
                </AdminContext.Provider>
            </CityContextProvider>
        )
    );

    it('shows cities in a select menu', async () => {
        expect(await screen.findByRole('option', { name: city.name })).toBeInTheDocument();
    });

    it('should not display a month input before a city is selected', () => {
        expect(screen.queryByRole('textbox')).toBeNull();
    });

    it('should display a month input after a city is selected', async () => {
        await screen.findByRole('option', { name: city.name });

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        userEvent.selectOptions(select, city.id.toString());

        expect(select.value).toBe(city.id.toString());
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should complain if the user submits an invalid month (from the future)', async () => {
        await screen.findByRole('option', { name: city.name });

        userEvent.selectOptions(screen.getByRole('combobox'), city.id.toString());

        userEvent.type(screen.getByRole('textbox'), '09/2040');
        userEvent.click(screen.getByText('Submit'));

        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
