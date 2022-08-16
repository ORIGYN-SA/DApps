import React from 'react';
import HeaderPart from '../components/Header';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('HeaderPart', () => {
  it('should return HeaderPart rendered', () => {
    render(<HeaderPart />);
    expect(screen.getByText('Library')).toBeInTheDocument();
    cleanup();
  });
  it('should match snapshot', () => {
    const { asFragment } = render(<HeaderPart />);
    expect(asFragment()).toMatchSnapshot();
    afterEach(cleanup);
  });
});
