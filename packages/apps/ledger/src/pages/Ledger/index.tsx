import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import {
  VersionLabel,
  TransactionFilter,
  TransactionsTable,
  SearchbarNft,
  SwitchCanisterCollection,
} from '@dapp/features-components';
import { SecondaryNav, Container, Banner } from '@origyn-sa/origyn-art-ui';

const Ledger = () => {
  const ledgerVersion: string = '0.1.0';
  const { actor } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    setSearchBarTokenId('');
    setIsLoading(true);
  }, [actor]);

  return (
  <Banner Banner fullWidth padding="0" flexFlow="column">
  <SecondaryNav
      title="Ledger"
      tabs={[{ title: 'Transactions', id: 'Transactions' }]}
      content={[
        <Container>
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
          <VersionLabel ledgerVersion={ledgerVersion} />
        </Container> 
      ]} 
    />
  </Banner>
  );
};

export default Ledger;
