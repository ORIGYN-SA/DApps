import React from 'react';
import LibraryBox from '../components/CollectionLibrary';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryBox />);

describe('LibraryBox', () => {
  test('should return LibraryBox rendered', () => {
    render(<LibraryBox />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
