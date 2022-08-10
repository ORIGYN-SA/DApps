import React from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import '@testing-library/jest-dom';
import { StartEscrowModal } from '../StartEscrowModal';
import testData from './data.json';

describe('Sales-Escrows > Modals > StartEscrowModal', () => {
  it('should have default values if provided', () => {
    const { getByText } = render(
      <StartEscrowModal initialValues={testData.initialValues} nft={testData.nft} />,
    );

    const setStateMock = jest.fn();
    const useStateMock = (useState) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const baycText = getByText('bayc-1');
    expect(baycText).toBeInTheDocument();
  });
});
