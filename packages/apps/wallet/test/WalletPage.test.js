import React from 'react';
import WalletPage from '../src/pages/Wallet';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('WalletPage', () => {
    it('should return WalletPage rendered', () => {
        render(<WalletPage />);
        expect(screen.getByText('Wallet')).toBeInTheDocument();
        cleanup();
    });
    it('should match snapshot', () => {
        const { asFragment } = render(<WalletPage />);
        expect(asFragment()).toMatchSnapshot();
        afterEach(cleanup);
    });
    })
