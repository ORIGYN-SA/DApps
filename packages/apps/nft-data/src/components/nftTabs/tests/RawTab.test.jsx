import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import data from './data';
import RawTab from '../RawTab';
describe('rawtab', () => {
    const { asFragment } = render(<RawTab metadata={data} />);
    it('should return rawtab rendered', () => {
        expect(screen.getByText('owner')).toBeInTheDocument();
        expect(screen.getByText('hidden_asset')).toBeInTheDocument();
        expect(screen.getByText('preview_asset')).toBeInTheDocument();
        expect(screen.getByText('primary_asset')).toBeInTheDocument();
        expect(screen.getByText('experience_asset')).toBeInTheDocument();
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('__apps')).toBeInTheDocument();
        expect(screen.getByText('library')).toBeInTheDocument();
       

    });
    it('should match snapshot', () => {
        expect(asFragment()).toMatchSnapshot();
    });

});