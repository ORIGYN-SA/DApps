import React from 'react';
import LibraryAccordion from '../components/LibraryAccordion';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryAccordion />);

describe('LibraryAccordion', () => {
  test('should return LibraryAccordion rendered', () => {
    render(<LibraryAccordion />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
