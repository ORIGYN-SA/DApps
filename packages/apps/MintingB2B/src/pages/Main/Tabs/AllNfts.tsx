import React from 'react';
import { Pagination, Container, Flex, Card } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { Link } from 'react-router-dom';

import { NftsPagination } from '../types';

export const AllNfts = ({ isLoading, nfts, pagination, onPageChange }: Props) => {
  return (
    <Container padding="16px">
      <br />
      <h2>NFTs</h2>
      <br />
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <Flex flexFlow="column" gap={8}>
          <Pagination
            pageCount={Math.ceil(pagination?.total / pagination?.limit)}
            onPageChange={onPageChange}
          />
          {nfts.map((item) => (
            <Card
              key={item.tokenId}
              as={Link}
              to={`/${item.tokenId}`}
              padding="8px"
              justify="space-between"
            >
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
            </Card>
          ))}
        </Flex>
      )}
    </Container>
  );
};

type Props = {
  isLoading: boolean;
  nfts: any;
  pagination: NftsPagination;
  onPageChange: (page: number) => void;
};
