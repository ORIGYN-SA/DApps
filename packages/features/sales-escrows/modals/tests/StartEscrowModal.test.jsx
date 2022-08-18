import React from 'react';
import { render } from '@testUtils';
import '@testing-library/jest-dom';
import { StartEscrowModal } from '../StartEscrowModal';
import testData from './data';

describe('Sales-Escrows > Modals > StartEscrowModal', () => {
  it('displays the nft name in title', () => {
    const { getByText } = render(<StartEscrowModal nft={testData.nft} open={true} />);

    const baycText = getByText('bayc-1');
    expect(baycText).toBeInTheDocument();
  });
  it('displays the default values', () => {
    const { getByLabelText } = render(
      <StartEscrowModal initialValues={testData.initialValues} nft={testData.nft} open={true} />,
    );
    for (const key of Object.keys(testData.initialValues)) {
      expect(getByLabelText(key)).toHaveValue(testData.initialValues[key]);
    }
  });
});
