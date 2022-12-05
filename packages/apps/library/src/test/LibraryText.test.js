import React from 'react';
import LibraryTextHtml from '../components/LayoutsType/LibraryTextHtml';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<LibraryTextHtml />);

describe('LibraryText', () => {
  test('should return LibraryText rendered', () => {
    render(<LibraryTextHtml />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
