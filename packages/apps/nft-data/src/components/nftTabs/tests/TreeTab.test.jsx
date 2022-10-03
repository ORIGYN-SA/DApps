import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TreeTab from '../TreeTab';
import data from './data';
describe('treetab', () => {
    const { asFragment } = render(<TreeTab metadata={data} />);
    it('should return treetab rendered', () => {
        expect(screen.getByText('Expand All')).toBeInTheDocument();
        expect(screen.getByText('Expand Apps')).toBeInTheDocument();
        expect(screen.getByText('Expand Libraries')).toBeInTheDocument();
        expect(screen.getByText('NFT')).toBeInTheDocument();
    });
    it('should match snapshot', () => {
        expect(asFragment()).toMatchSnapshot();
    });

});