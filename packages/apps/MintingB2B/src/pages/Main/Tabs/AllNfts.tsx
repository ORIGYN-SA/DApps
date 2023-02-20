import React from 'react';
import styled from 'styled-components';
import { Pagination, Container, Flex, Card, Grid, HR, Button, CustomTable, Banner } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
import { Link, useNavigate } from 'react-router-dom';

import { NftsPagination } from '../types';

const PaginationWrap = styled.div`

  > div {
    display: flex;
    align-items: center;
    justify-content: center;

     > div > div {
      width: auto;
    }
  }

  p {
    font-weight: 600;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: -0.1px;
    color: #5F5F5F;
  }

  button {
    height: 40px;
    width: 40px;
  }

  .pageCard {
    border-radius: 50%;

    &:hover {
      background: #E3E3E3;
    }
  }
  .active {
    background: #E3E3E3;
  }
`

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
                  <Banner onClick={() => navigate(`/${nft.tokenId}`)} style={{width: "100%" }} padding="16px" bgColor={index % 2 ?  "BACKGROUND" : "BORDER"}>
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
            <PaginationWrap>
              <Pagination
                pageCount={Math.ceil(pagination?.total / pagination?.limit)}
                onPageChange={onPageChange}
              />
            </PaginationWrap>
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
