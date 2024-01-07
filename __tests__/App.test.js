import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
}));

jest.mock('expo-font', () => ({
    useFonts: jest.fn().mockReturnValue([true]),
    isLoaded() {
        return true;
    },
}));

describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree.children.length).toBe(1);
    });
});
