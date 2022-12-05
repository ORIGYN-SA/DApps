import React from 'react';
import HeaderPart from '../components/Header';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<HeaderPart />);

describe('HeaderPart', () => {
  test('should return HeaderPart rendered', () => {
    render(<HeaderPart />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
