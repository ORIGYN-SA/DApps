import React from 'react';
import LibraryBox from '../components/LibraryBox';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('LibraryBox', () => {
  it('should return LibraryBox rendered', () => {
    render(<LibraryBox />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    const { asFragment } = render(<LibraryBox />);
    expect(asFragment()).toMatchSnapshot();
    afterEach(cleanup);
  });
});
