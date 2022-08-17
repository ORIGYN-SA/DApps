import React from 'react';
import LibraryBox from '../components/LibraryBox';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryBox />);

describe('LibraryBox', () => {
  it('should return LibraryBox rendered', () => {
    render(<LibraryBox />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
