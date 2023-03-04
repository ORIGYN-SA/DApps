import React from 'react';
import { render } from '@testUtils';
import '@testing-library/jest-dom';
import { ConfirmSalesActionModal } from '../ConfirmSalesActionModal';
import testData from './data';

describe('Sales-Escrows > Modals > ConfirmSalesActionModal', () => {
  it('displays confirm text for withdraw action', () => {
    const { getByText } = render(
      <ConfirmSalesActionModal currentToken={testData.nft} open={true} action="withdraw" />,
    );
    const confirmText = getByText('Are you sure you want to withdraw the escrow?');
    expect(confirmText).toBeInTheDocument();
  });
  it('displays reject text for withdraw action', () => {
    const { getByText } = render(
      <ConfirmSalesActionModal currentToken={testData.nft} open={true} action="reject" />,
    );
    const rejectText = getByText('Are you sure you want to reject the escrow?');
    expect(rejectText).toBeInTheDocument();
  });
  it('displays the confirm button', () => {
    const { getByText } = render(
      <ConfirmSalesActionModal currentToken={testData.nft} open={true} action="withdraw" />,
    );
    const confirmText = getByText('Confirm');
    expect(confirmText).toBeInTheDocument();
  });
});
