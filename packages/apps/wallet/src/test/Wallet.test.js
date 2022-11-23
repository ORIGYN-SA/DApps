import React from 'react';
import WalletPage from '../pages/Wallet';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabPanel } from '@mui/lab';

const { asFragment } = render(<WalletPage />);

describe('WalletPage', () => {
  //test 1
  test('should return WalletPage rendered', () => {
    render(<WalletPage />);
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    cleanup();
  });
  //test 2
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
  //test 3
  test('If is loading should display only preloader in the tabpanel', () => {
    render(<TabPanel isLoading={true}/> );
    const Loader = screen.getByRole('progressbar');
    expect(Loader).toBeInTheDocument();
    cleanup();
  });
  // test 4
  test('If its not loading should display the tab', () => {
    render(<TabPanel isLoading={false} />);
    const Tab = screen.getByLabelText('Tabs');
    expect(Tab).toBeInTheDocument();
    cleanup();
  });
});
