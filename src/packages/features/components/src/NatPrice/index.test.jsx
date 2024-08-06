import { NatPrice } from './index';
import React from 'react';
import { render } from '../../../../../../testUtils';
import '@testing-library/jest-dom';

describe('Components > NatPrice', () => {
  it('converts to readable price from Nat', () => {
    const INPUT_VALUE = 12345678n;
    const OUTPUT_VALUE = '0.12345678';
    const { getByText } = render(<NatPrice value={INPUT_VALUE} symbol={'OGY'} />);
    expect(getByText(OUTPUT_VALUE)).toBeInTheDocument();
  });
  it('shows value only if no symbol is provided', () => {
    const INPUT_VALUE = 12345678n;
    const { queryByRole } = render(<NatPrice value={INPUT_VALUE} />);
    expect(queryByRole('img')).not.toBeInTheDocument();
  });
});
