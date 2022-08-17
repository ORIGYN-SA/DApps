import React from 'react';
import LibraryImage from '../components/LibraryImage';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryImage />);

describe('LibraryImage', () => {
  it('should return LibraryImage rendered', () => {
    render(<LibraryImage />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
