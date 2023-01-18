import React from 'react';
import { Pagination, Container, Flex, Card, Grid, HR } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { Link } from 'react-router-dom';

import { NftsPagination } from '../types';

export const AllNfts = ({ isLoading, nfts, pagination, onPageChange }: Props) => {
  return (
    <Container padding="16px">
      <br />
      <h2>Certificates</h2>
      <br />
      <p>Below is a list of all of the minted Certificates</p>
      <br />
      <HR />
      <br />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <Flex flexFlow="column" gap={8}>
          {nfts.map((item) => (
            <Card
              key={item.tokenId}
              as={Link}
              to={`/${item.tokenId}`}
              padding="8px"
              justify="space-between"
            >
              <Grid columns={3} style={{ width: "100%" }}>
                <Flex flexFlow="column" gap={4}>
                  <p className="secondary_color">Token ID</p>
                  <p>{item.tokenId}</p>
                </Flex>
                <Flex flexFlow="column" gap={4}>
                  <p className="secondary_color">App Type</p>
                  <p>{item.appType}</p>
                </Flex>
                <Flex flexFlow="column" gap={4}>
                  <p className="secondary_color">Status</p>
                  <p>{item.status}</p>
                </Flex>
              </Grid>
            </Card>
          ))}
        </Flex>
      )}
      <br />
      <Flex align="center" justify="center">
        <Pagination
          pageCount={Math.ceil(pagination?.total / pagination?.limit)}
          onPageChange={onPageChange}
        />
      </Flex>
    </Container>
  );
};

type Props = {
  isLoading: boolean;
  nfts: any;
  pagination: NftsPagination;
  onPageChange: (page: number) => void;
};
