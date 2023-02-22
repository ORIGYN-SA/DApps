import React from 'react';
import VaultPage from '../pages/Vault';
import { render, screen, cleanup, test } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabPanel } from '@mui/lab';

const { asFragment } = render(<VaultPage />);

describe('VaultPage', () => {
  //test 1
  test('should return VaultPage rendered', () => {
    render(<VaultPage />);
    expect(screen.getByText('Vault')).toBeInTheDocument();
    cleanup();
  });
  //test 2
  test('should match snapshot', () => {
    expect(asFragment()).toMatchSnapshot();
  });
  //test 3
  test('If is loading should display only preloader in the tabpanel', () => {
    render(<TabPanel isLoading={true} />);
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
