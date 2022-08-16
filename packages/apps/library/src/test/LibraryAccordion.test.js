import React from 'react';
import LibraryAccordion from '../components/LibraryAccordion';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('LibraryAccordion', () => {
  it('should return LibraryAccordion rendered', () => {
    render(<LibraryAccordion />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    const { asFragment } = render(<LibraryAccordion />);
    expect(asFragment()).toMatchSnapshot();
    afterEach(cleanup);
  });
});
