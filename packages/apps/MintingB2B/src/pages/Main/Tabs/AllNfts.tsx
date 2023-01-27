import React from 'react';
import { Pagination, Container, Flex, Card, Grid, HR, Button, CustomTable } from '@origyn-sa/origyn-art-ui';
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
      <Container padding="16px">
        <br />
        <h2>Certificates</h2>
        <br />
        <p>Below is a list of all of the minted Certificates</p>
        <br />
      </Container>
      <HR />
      <Container padding="16px">
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <Flex flexFlow="column" gap={8}>
            <CustomTable
              cells={tableCells}
              rows={nfts.map((nft) => {
                return {
                  tokenId: nft.tokenId,
                  type: nft.appType,
                  status: nft.status,
                  actions: (
                    <Button btnType="filled" onClick={() => navigate(`/${nft.tokenId}`)}>
                      Show Details
                    </Button>
                  ),
                };
              })}
            />
          </Flex>
        )}
        <br />
        <Grid columns={3}>
          <div />
          <Pagination
            pageCount={Math.ceil(pagination?.total / pagination?.limit)}
            onPageChange={onPageChange}
          />
          <div />
        </Grid>
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
