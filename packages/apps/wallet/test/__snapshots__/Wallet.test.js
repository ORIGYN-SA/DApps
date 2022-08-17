import React from 'react';
import WalletPage from '../../src/pages/Wallet';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<WalletPage />);

describe('WalletPage', () => {
  test('should return WalletPage rendered', () => {
    render(<WalletPage />);
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    cleanup();
  });
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
