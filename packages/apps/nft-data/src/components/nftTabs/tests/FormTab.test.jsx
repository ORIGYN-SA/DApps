import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormTab from '../FormTab';
import data from './data';
describe('formtab', () => {
    const { asFragment } = render(<FormTab metadata={data} />);
    it('should return formtab rendered', () => {
        expect(screen.getByText('Info')).toBeInTheDocument();
        expect(screen.getByText('owner')).toBeInTheDocument();
        expect(screen.getByText('hidden_asset')).toBeInTheDocument();
        expect(screen.getByText('preview_asset')).toBeInTheDocument();
        expect(screen.getByText('primary_asset')).toBeInTheDocument();
        expect(screen.getByText('experience_asset')).toBeInTheDocument();
        expect(screen.getByText('id')).toBeInTheDocument();


        data.__apps.forEach((item, i) => {
            expect(screen.getByText(`app ${i + 1}`)).toBeInTheDocument();

        });
        data.library.forEach((item, i) => {
            expect(screen.getByText(`library ${i + 1}`)).toBeInTheDocument();

        });
       

    });
    it('should match snapshot', () => {
        expect(asFragment()).toMatchSnapshot();
    });

});