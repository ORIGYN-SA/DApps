import React from 'react';
import LibraryText from '../components/LibraryText';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryText />);

describe('LibraryText', () => {
  it('should return LibraryText rendered', () => {
    render(<LibraryText />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
