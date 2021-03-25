import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import TreeList from '../components/TreeList';

const sampleData = [
    {
        name: 'Herb',
        id: '1',
        children: [
            {
                name: 'Eric',
                id: '2',
                children: [
                    { name: 'Gabe', id: '4', children: [] },
                    { name: 'Claire', id: '5', children: [] },
                    { name: 'Zach', id: '6', children: [] },
                ],
            },
            { name: 'Matt', id: '3', children: [] },
        ],
    },
];

describe('TreeList', () => {
    it('should only display top-level items before being clicked', () => {
        render(<TreeList data={sampleData} />);
        const topLevelItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Herb');
        const secondaryItem = screen
            .queryAllByRole('listitem')
            .find(el => el.textContent == 'Eric');
        expect(topLevelItem).toBeInTheDocument();
        expect(secondaryItem).toBeUndefined();
    });

    it('should display second-level items after parent has been clicked', () => {
        render(<TreeList data={sampleData} />);
        const topLevelItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Herb');
        userEvent.click(topLevelItem as HTMLElement);
        const secondaryItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Eric');
        expect(topLevelItem).toBeInTheDocument();
        expect(secondaryItem).toBeInTheDocument();
    });

    it('should display second-level items as children of parent', () => {
        render(<TreeList data={sampleData} />);
        const topLevelItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Herb');
        userEvent.click(topLevelItem as HTMLElement);
        const secondaryItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Eric');
        // the parent of the secondary item is a ul tag, the li tag is actually parent of the parent
        expect(secondaryItem?.parentElement?.parentElement).toBe(topLevelItem);
    });

    it('should hide second-level items after parent has been clicked again', () => {
        render(<TreeList data={sampleData} />);
        const topLevelItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Herb');
        userEvent.click(topLevelItem as HTMLElement);
        userEvent.click(topLevelItem as HTMLElement);
        const secondaryItem = screen
            .queryAllByRole('listitem')
            .find(el => el.textContent == 'Eric');
        expect(secondaryItem).toBeUndefined();
    });

    it('should work recursively', () => {
        render(<TreeList data={sampleData} />);
        const topLevelItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Herb');
        userEvent.click(topLevelItem as HTMLElement);
        const secondaryItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Eric');
        userEvent.click(secondaryItem as HTMLElement);
        const tertiaryItem = screen.getAllByRole('listitem').find(el => el.textContent == 'Gabe');
        expect(tertiaryItem).toBeInTheDocument();
        userEvent.click(topLevelItem as HTMLElement);
        expect(tertiaryItem).not.toBeInTheDocument();
        expect(secondaryItem).not.toBeInTheDocument();
    });
});
