import React from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import '@testing-library/jest-dom';
import { StartEscrowModal } from '../StartEscrowModal';
import testData from './data';

describe('Sales-Escrows > Modals > StartEscrowModal', () => {
  it('should have default values if provided', () => {
    const { getByText } = render(
      <StartEscrowModal initialValues={testData.initialValues} nft={testData.nft} open={true} />,
    );

    const baycText = getByText('bayc-1');
    expect(baycText).toBeInTheDocument();
  });
});
