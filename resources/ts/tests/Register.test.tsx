import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { users } from './backend-helpers/mock-backend-data';
import Register from '../pages/Register';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { AuthProvider } from '../hooks/useAuth';
import { StaticRouter } from 'react-router';
import { server, rest } from './backend-helpers/server';

const handleSuccess = jest.fn();

beforeEach(() => {
    render(
        <StaticRouter>
            <AuthProvider>
                <Register />
            </AuthProvider>
        </StaticRouter>
    );
});

describe('Register page with happy-path api calls', () => {
    beforeAll(() => {
        server.use(
            rest.get('/user', async (req, res, ctx) => {
                return res(ctx.status(403));
            })
        );
    });

    it('should show instructor options when user selects the student role', async () => {
        userEvent.selectOptions(screen.getByRole('combobox'), 'student');
        expect(screen.queryByLabelText("Your instructor's name")).toBeInTheDocument();
        expect(await screen.findByRole('option', { name: users[0].name })).toBeInTheDocument();
    });

    it('should not show further options before user selects a role', () => {
        expect(screen.queryByRole('input')).not.toBeInTheDocument();
    });

    it('should show further options when user selects a role', async () => {
        userEvent.selectOptions(screen.getByRole('combobox'), 'contributor');
        expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    });

    it('should not show instructor options when user selects a role other than student', async () => {
        userEvent.selectOptions(screen.getByRole('combobox'), 'contributor');
        expect(screen.queryByLabelText('instructors')).not.toBeInTheDocument();
    });

    it('should call handleSuccess callback with submitted role upon success', async () => {
        const role = 'contributor';
        userEvent.selectOptions(screen.getByRole('combobox'), role);
        userEvent.click(screen.getByRole('button'));
        waitFor(() => expect(handleSuccess).toHaveBeenCalledWith(role));
    });
});
