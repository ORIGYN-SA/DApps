import React from 'react';
import { Pagination, Container, Flex, Card, Grid, HR, Button, CustomTable, Banner } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { Link, useNavigate } from 'react-router-dom';

import { NftsPagination } from '../types';

const tableCells = [
  {
    id: 'tokenId',
    label: 'Token ID',
  },
  {
    id: 'type',
    label: 'App Type',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];
export const AllNfts = ({ isLoading, nfts, pagination, onPageChange }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <Container padding="46px 24px">
        <h2>Certificates</h2>
        <br />
        <p>Below is a list of all of the minted Certificates</p>
      </Container>
      <HR />
      <Container padding="24px 16px 16px 16px">
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <>
          <Flex flexFlow="column" gap={24} style={{fontSize: 12}}>
            <div style={{padding: "0 8px"}}>
              <Grid columns={3}>
                <div>Token ID</div>
                <div>App Type</div>
                <div>Status</div>
              </Grid>
              <HR />
            </div>
            {nfts.map((nft, index) => {
              console.log(nft);
                return (
                  <Banner onClick={() => navigate(`/${nft.tokenId}`)} style={{width: "100%" }} padding="16px" bgColor={index % 2 ? "BORDER" : "BACKGROUND"}>
                    <Grid columns={3} style={{width: "100%"}} gap={12}>
                      <Flex flexFlow="column">
                        <div><b>Token ID</b></div>
                        <div>{nft.tokenId}</div>
                      </Flex>
                      <Flex align="center">{nft.appType}</Flex>
                      <Flex align="center">{nft.status}</Flex>
                    </Grid>
                  </Banner>
                )
              })}
          </Flex>
          <br />
          <Grid columns={3}>
            <div />
            <Pagination
              pageCount={Math.ceil(pagination?.total / pagination?.limit)}
              onPageChange={onPageChange}
            />
            <div />
          </Grid>
          </>
        )}
      </Container>
    </>
  );
};

type Props = {
  isLoading: boolean;
  nfts: any;
  pagination: NftsPagination;
  onPageChange: (page: number) => void;
};
