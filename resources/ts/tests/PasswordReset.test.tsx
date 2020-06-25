import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import PasswordReset from '../components/PasswordReset';
import AdminContext from '../contexts/AdminContext';
import { City } from '../types/api';

let el: ReactTestRenderer;

const context = {
    cities: [] as City[],
    users: [{ name: 'Matthew Nelson', email: 'email@email.com', id: 1, role: 'admin' }],
};

beforeEach(() => {
    el = create(
        <AdminContext.Provider value={context}>
            <PasswordReset />
        </AdminContext.Provider>
    );
});

describe('Password Reset', () => {
    it('renders correctly', () => {
        expect(el).toMatchSnapshot();
    });

    it('contains no buttons before user provides input', () => {
        const inputs = el.root.findAllByType('button');
        expect(inputs.length).toBe(0);
    });

    it('contains a button with correct name if user begins typing a search term', () => {
        const input = el.root.findByType('input');
        expect(input.children.includes('Matthew Nelson (email@email.com)')).toBe(false);
        act(() => input.props.onChange({ target: { value: 'Matt' } }));

        const button = el.root.findByType('button');
        expect(button.children.includes('Matthew Nelson (email@email.com)')).toBe(true);
    });

    it('contains no buttons if user deletes their search term', () => {
        const input = el.root.findByType('input');
        act(() => input.props.onChange({ target: { value: 'Matt' } }));
        act(() => input.props.onChange({ target: { value: '' } }));

        const buttons = el.root.findAllByType('button');
        expect(buttons.length).toBe(0);
    });
});
