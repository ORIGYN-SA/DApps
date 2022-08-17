import React from 'react';
import LibraryText from '../components/LibraryText';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryText />);

describe('LibraryText', () => {
  test('should return LibraryText rendered', () => {
    render(<LibraryText />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
