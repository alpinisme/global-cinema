import React from 'react';
import { create } from 'react-test-renderer';
import ErrorBox from '../components/ErrorBox';

describe('ErrorBox', () => {
    test('renders correctly', () => {
        const box = <ErrorBox errors={['error']} />;
        const tree = create(box).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('empty error array produces nothing', () => {
        const box = <ErrorBox errors={[]} />;
        const idea = create(box).root;
        expect(idea.children.length).toBe(0);
    });
});
