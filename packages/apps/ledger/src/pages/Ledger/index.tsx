import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import {VersionLabel, TransactionFilter, TransactionsTable, SearchbarNft } from '@dapp/features-components';

const container_style = {
  size: 'l',
  padding: '12px',
};

const Ledger = () => {
  const ledgerVersion: string = '0.1.0';
  const [isLoading, setIsLoading] = useState(false);
  const [searchBarTokenId, setSearchBarTokenId] = React.useState('');
  const [indexID, setIndexID] = React.useState('');
  const [filter, setFilter] = useState<{
    searchInputValue: string;
    categoryToFilter: string;
    transactionType: string;
    update: number;
  }>({
    searchInputValue: '',
    categoryToFilter: '',
    transactionType: '',
    update: 0,
  });

  const [transactionData, setTransactionData] = useState([]);
  const [trans_types, setTrans_types] = React.useState([]);

  return (
    <Container sx={container_style}>
      <Box
        margin="0 0 0 0"
        display="flex"
        flexDirection="column"
        alignItems="center"
      > 
        <SearchbarNft
          setSearchBarTokenId={setSearchBarTokenId}
          setIndexID={setIndexID}
          searchBarTokenId={searchBarTokenId}
          isLoading={isLoading}
        />

        <TransactionFilter
          isLoading={isLoading}
          setFilter={setFilter}
          trans_types={trans_types}
          setTrans_types={setTrans_types}
          transactionData={transactionData}
          searchBarTokenId={searchBarTokenId}
        />
      </Box>
      <TransactionsTable
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        searchBarTokenId={searchBarTokenId}
        indexID={indexID}
        setIndexID={setIndexID}
        filter={filter}
        setFilter={setFilter}
        setTrans_types={setTrans_types}
        setTransactionData={setTransactionData}
        transactionData={transactionData}
      />
      <VersionLabel
        ledgerVersion={ledgerVersion}
      />
    </Container>
  );
};

export default Ledger;
