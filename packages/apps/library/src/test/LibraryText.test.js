import React from 'react';
import LibraryText from '../components/LibraryText';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('LibraryText', () => {
  it('should return LibraryText rendered', () => {
    render(<LibraryText />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    const { asFragment } = render(<LibraryText />);
    expect(asFragment()).toMatchSnapshot();
    afterEach(cleanup);
  });
});
