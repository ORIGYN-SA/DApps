import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import testData from './data';

import { TransactionsTable } from '..';
const Wrapper = () => {

  const myFilter ={
    searchInputValue: '',
    categoryToFilter: '',
    transactionType: '',
    update: 0
  }
  const myTrans=[{
      trans_index: '0',
      token_id: 'bm-1',
      type_txn: 'Mint',
      message: 'Mint',
      accounts: ['92335d6272f9f32fcf5ca1586e1d8893581099c3436d5d1f59ab3751c6709282'],
      principals: [],
      mint_from: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
      mint_to: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
      sale: {
        token: 'Token not defined',
        amount: 'Amount not defined',
      }}
    ];

  const [isLoading,setIsLoading] = useState(false);
  const [indexID,setIndexID] = useState('');
  const [filter, setFilter] = useState(myFilter);
   const [transactionData, setTransactionData] = useState([myTrans]);
   const [trans_types, setTrans_types] = React.useState([]);

  return (
    <TransactionsTable
    setIsLoading={setIsLoading}
    isLoading={isLoading}
    searchBarTokenId={"myTOkenId"}
    indexID={indexID}
    setIndexID={setIndexID}
    filter={filter}
    setFilter={setFilter}
    setTrans_types={setTrans_types}
    setTransactionData={setTransactionData}
    transactionData={transactionData}
    />
  );
};
describe('Components>TransactionsTable', () => {
  // Test1
  test('If is loading should display only preloader', () => {
    // Render
    render(<TransactionsTable isLoading={true} />);
    const Loader = screen.getByRole('progressbar');
    expect(Loader).toBeInTheDocument();
    cleanup();
  });
  // Test2
  test('If is not loading should display the table', () => {
    // Render
    render(<TransactionsTable isLoading={false} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test3
  test('If tokenId is not present show #Select a token Id', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'Not selected'} />);
    const Placeholder = screen.getByText('Select a Token ID');
    expect(Placeholder).toBeInTheDocument();
    cleanup();
  });
  // Test4
  test('If tokenId is present and there are transactions found show the table', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'#myId'} isEmpty={false} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test5  - This test is failing because the component is not rendering the table when there are no transactions found
  test('If tokenId is present and there are no transactions found show the table', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'#myId'} isEmpty={true} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test6
  //take a snapshot of the component
  test('Snapshot', () => {
    const { asFragment } = render(<TransactionsTable isLoading={false} />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  } 
  );
  // Test7
  // the render of the wrapper should match the snapshot
  test('Render', () => {
    const { asFragment } = render(<Wrapper />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  }
  );
  // Test8
  // the wrapper should contain the table
  test('Table', () => {
    const { asFragment } = render(<Wrapper />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  }
  );
  // Test 9
  // the wrapper should contain rows
  test('Rows', () => {
    const { asFragment } = render(<Wrapper />);
    const Rows = screen.getAllByRole('row');
    expect(Rows).toHaveLength(1);
    cleanup();
  }
  );

});
