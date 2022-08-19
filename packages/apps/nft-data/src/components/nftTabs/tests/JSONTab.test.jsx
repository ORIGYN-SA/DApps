import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import data from './data';
import JSONTab from '../JSONTab';
describe('jsontab', () => {
    const { asFragment } = render(<JSONTab metadata={data} />);
    it('should return jsontab rendered', () => {
        screen.getByTestId('jsontable')
       

    });
    it('should match snapshot', () => {
        expect(asFragment()).toMatchSnapshot();
    });

});