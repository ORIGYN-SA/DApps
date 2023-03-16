import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { TransactionFilter, TransactionsTable, SearchbarNft } from '@dapp/features-components';
import { SecondaryNav, Container, Flex, HR } from '@origyn/origyn-art-ui';
import styled from 'styled-components';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Ledger = () => {
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchBarTokenId, setSearchBarTokenId] = React.useState('');
  const [invalidToken, setInvalidToken] = React.useState<boolean>(false);
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

  useEffect(() => {
    document.title = 'Origyn Digital Certificates Ledger';
  }, []);

  return (
    <Container fullWidth padding="0" flexFlow="column">
      <SecondaryNav
        title="Ledger"
        tabs={[{ title: 'Dashboard', id: 'Transactions' }]}
        content={[
          <>
            <Flex fullWidth flexFlow="column">
              <StyledSectionTitle>Ledger Dashboard</StyledSectionTitle>
              <HR />
            </Flex>
            <Container>
              <>
                {invalidToken ? (
                  <>
                    <Container padding="16px">
                      <Flex align="center" justify="center">
                        <h4>Token Id is invalid</h4>
                      </Flex>
                      <HR marginTop={16} marginBottom={16} />
                    </Container>
                  </>
                ) : (
                  <>
                    <SearchbarNft
                      setSearchBarTokenId={setSearchBarTokenId}
                      setIndexID={setIndexID}
                      searchBarTokenId={searchBarTokenId}
                      isLoading={isLoading}
                      setInvalidToken={setInvalidToken}
                    />
                    <HR marginTop="16px" marginBottom="16px" />
                    <TransactionFilter
                      isLoading={isLoading}
                      setFilter={setFilter}
                      trans_types={trans_types}
                      setTrans_types={setTrans_types}
                      transactionData={transactionData}
                      searchBarTokenId={searchBarTokenId}
                    />
                    <HR marginTop="16px" marginBottom="16px" />
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
                  </>
                )}
              </>
            </Container>
          </>,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </Container>
  );
};

export default Ledger;
