import { NFTPage } from '@dapp/features-sales-escrows';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

const { asFragment } = render(<NFTPage />);

describe('NFTPage', () => {
  it('renders correctly', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
