import React, { useContext, useEffect, useState } from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
  getAllByLabelText,
} from '../../../../../../testUtils';
import '@testing-library/jest-dom';

import { TransactionFilter } from '../index';

describe('Features > Component > TransactionFilter', () => {
  const Wrapper = () => {
    const [filter, setFilter] = useState('');
    const [trans_types, setTrans_types] = useState(['mint', 'auctionBid']);
    return (
      <TransactionFilter
        setFilter={setFilter}
        setTrans_types={setTrans_types}
        trans_types={trans_types}
        isLoading={false}
        searchBarTokenId = {'#myTokenId'}
      />
    );
  };
  const FilterUnavailable = () => {
    const [filter, setFilter] = useState('');
    const [trans_types, setTrans_types] = useState(['mint', 'auctionBid']);
    return (
      <TransactionFilter
        setFilter={setFilter}
        setTrans_types={setTrans_types}
        trans_types={trans_types}
        isLoading={false}
        searchBarTokenId = {'Not selected'}
      />
    );
  };


  // Test1
  // if isLoading is false all the input should be enabled
  it('should be enabled when isLoading is false', () => {
    const { getByLabelText } = render(<Wrapper />);
    expect(getByLabelText('Enter a value')).toBeEnabled;
    cleanup();
  });

  // Test2
  // the render should match the snapshot
    it('should match the snapshot', () => {
        const { asFragment } = render(<Wrapper />);
        expect(asFragment()).toMatchSnapshot();
        cleanup();
        }
    );

  // Test3
  // if tokenId is not selected the search bar should be disabled
  it('should be disabled when tokenId is not selected', () => {
    const { getByLabelText } = render(<FilterUnavailable />);
    expect(getByLabelText('Filters unavailables, select a Token ID')).toBeInTheDocument();
    cleanup();
  }
  );
});