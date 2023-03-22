import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDialog } from '@connect2ic/react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { OrigynClient } from '@origyn/mintjs';
import { useDebug } from '@dapp/features-debug-provider';
import { useApi } from '@dapp/common-api';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { PlaceholderIcon } from '@dapp/common-assets';
import { OdcDataWithSale, parseOdcs, parseMetadata, toLargerUnit } from '@dapp/utils';
import { useUserMessages } from '@dapp/features-user-messages';
import { useMarketplace } from '../../components/context';
import Filter from '../../../../vault/src/pages/Vault/Filter';
import {
  Card,
  Container,
  Flex,
  HR,
  Grid,
  Image,
  SecondaryNav,
  ShowMoreBlock,
} from '@origyn/origyn-art-ui';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Marketplace = () => {
  const debug = useDebug();
  const { principalId, actor, handleLogOut } = useContext(AuthContext);
  const { getNftBatch, getNftCollectionMeta } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const [canisterId, setCanisterId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputText, setInputText] = useState('');
  const { open } = useDialog();
  const { state, dispatch } = useMarketplace();
  const { totalItems, collectionData, odcs, filter, sort, filteredOdcs } = state;

  const logout = async () => {
    handleLogOut();
    fetchData();
  };

  const fetchData = async () => {
    if (!actor) {
      return;
    }

    try {
      const { canisterId } = await useRoute();
      setCanisterId(canisterId);

      OrigynClient.getInstance().init(true, canisterId, { actor });

      // get the canister's collection metadata
      const meta = await getNftCollectionMeta();
      const metadata = meta.metadata[0];
      const metadataClass = 'Class' in metadata ? metadata.Class : [];
      const collectionData = parseMetadata(metadataClass);
      dispatch({ type: 'collectionData', payload: collectionData });

      // set number of tokens
      const tokenIds = meta?.token_ids?.[0] || [];
      debug.log('tokenIds', meta?.token_ids?.[0]);

      dispatch({ type: 'totalItems', payload: tokenIds.length });

      // get a list of all digital certificates in the collection
      const odcs = await getNftBatch(tokenIds);
      debug.log('odcs', odcs);
      const parsedOdcs = parseOdcs(odcs);
      debug.log('parsed odcs', parsedOdcs);
      dispatch({ type: 'odcs', payload: parsedOdcs });
    } catch (err) {
      showUnexpectedErrorMessage(err);
    } finally {
      setIsLoaded(true);
    }
  };

  const getPrice = (odc: OdcDataWithSale): string => {
    const price = odc.currentBid
      ? toLargerUnit(odc.currentBid, odc.token.decimals)
      : toLargerUnit(odc.buyNow, odc.token.decimals);
    return price.toFixed();
  };

  useEffect(() => {
    document.title = 'Origyn Marketplace';

    const run = async () => {
      const route = await useRoute();
      setCanisterId(route.canisterId);
    };

    run();
  }, []);

  /* Fetch data from canister when the actor reference
   * is ready, then every 5 seconds */
  useEffect(() => {
    fetchData();
    let intervalId: any;
    if (!intervalId) {
      intervalId = setInterval(() => {
        fetchData();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [actor]);

  /* Apply filter and sort to list */
  useEffect(() => {
    let filtered = odcs;

    switch (filter) {
      case 'onSale':
        filtered = filtered.filter((odc) => odc.auctionOpen);
        break;
      case 'notOnSale':
        filtered = filtered.filter((odc) => !odc.auctionOpen);
        break;
    }

    switch (sort) {
      case 'saleASC':
        filtered = [...filtered].sort((odc1, odc2) => {
          return Math.max(odc2.buyNow, odc2.currentBid) - Math.max(odc1.buyNow, odc1.currentBid);
        });
        break;
      case 'saleDESC':
        filtered = [...filtered].sort((odc1, odc2) => {
          return Math.max(odc1.buyNow, odc1.currentBid) - Math.max(odc2.buyNow, odc2.currentBid);
        });
        break;
    }

    if (inputText?.length) {
      filtered = filtered.filter((odc) =>
        (odc.displayName || odc.id)?.toLowerCase().includes(inputText),
      );
    }

    dispatch({ type: 'filteredOdcs', payload: filtered });
  }, [filter, sort, inputText, odcs]);

  return (
    <Flex fullWidth padding="0" flexFlow="column">
      <SecondaryNav
        title="Marketplace"
        tabs={[{ title: 'Marketplace', id: 'Marketplace' }]}
        content={[
          <Flex fullWidth flexFlow="column" key="marketplace-nav">
            <StyledSectionTitle>Marketplace Dashboard</StyledSectionTitle>
            <HR />
            {!isLoaded ? (
              <LoadingContainer margin="48px" />
            ) : (
              <>
                {collectionData && (
                  <div>
                    <Container padding="32px">
                      <Flex align="flex-start" gap={24}>
                        {collectionData.hasPreviewAsset ? (
                          <Image
                            src={`https://prptl.io/-/${canisterId}/collection/preview`}
                            alt="text"
                            style={{ width: 200 }}
                          />
                        ) : (
                          <Flex align="center" justify="center">
                            <PlaceholderIcon width={200} height={200} />
                          </Flex>
                        )}
                        <Flex flexFlow="column" justify="space-between" gap={8}>
                          <h2>
                            <b>{collectionData?.displayName}</b>
                          </h2>
                          <p>
                            <span className="secondary_color">Created by </span>
                            <span className="secondary_color">
                              {collectionData.originatorPrincipalId || 'no creator name'}
                            </span>
                          </p>
                          <br />
                          <Flex>
                            <Flex flexFlow="column">
                              <h5>{totalItems}</h5>
                              <p className="secondary_color">Total Items</p>
                            </Flex>
                          </Flex>
                          <br />
                          <ShowMoreBlock btnText="Read More">
                            <p>{collectionData?.description}</p>
                          </ShowMoreBlock>
                          <br />
                          <br />
                        </Flex>
                      </Flex>
                    </Container>
                    <HR />
                    <Container padding="32px">
                      <Filter
                        initialFilterValue={filter}
                        initialSortValue={sort}
                        onChangeFilter={(filterValue: string) =>
                          dispatch({ type: 'filter', payload: filterValue })
                        }
                        onChangeSort={(sortValue: string) =>
                          dispatch({ type: 'sort', payload: sortValue })
                        }
                        onInput={setInputText}
                      />
                      <br />
                      <br />
                      {filteredOdcs?.length > 0 ? (
                        <>
                          <Grid
                            smColumns={1}
                            mdColumns={2}
                            lgColumns={3}
                            xlColumns={4}
                            columns={6}
                            gap={20}
                          >
                            {filteredOdcs.map((odc: OdcDataWithSale) => {
                              return (
                                <Link to={`/${odc?.id}`} key={odc?.id}>
                                  <Card
                                    flexFlow="column"
                                    style={{ overflow: 'hidden', height: '100%' }}
                                  >
                                    {odc.hasPreviewAsset ? (
                                      <Image
                                        style={{ width: '100%' }}
                                        src={`https://${canisterId}.raw.ic0.app/-/${odc?.id}/preview`}
                                        alt=""
                                      />
                                    ) : (
                                      <Flex align="center" justify="center">
                                        <PlaceholderIcon width={'100%'} />
                                      </Flex>
                                    )}
                                    <Container
                                      style={{ height: '100%' }}
                                      size="full"
                                      padding="16px"
                                    >
                                      <Flex
                                        style={{ height: '100%' }}
                                        justify="space-between"
                                        flexFlow="column"
                                        gap={32}
                                      >
                                        <div>
                                          <p style={{ fontSize: '12px', color: '#9A9A9A' }}>
                                            {collectionData?.displayName}
                                          </p>
                                          <p>
                                            <b>{odc?.displayName || odc?.id}</b>
                                          </p>
                                        </div>
                                        <div>
                                          <p style={{ fontSize: '12px', color: '#9A9A9A' }}>
                                            Status
                                          </p>
                                          <p>
                                            {odc.auctionOpen ? (
                                              <>
                                                {getPrice(odc)}{' '}
                                                <TokenIcon symbol={odc.tokenSymbol} />
                                              </>
                                            ) : (
                                              'No auction started'
                                            )}
                                          </p>
                                        </div>
                                      </Flex>
                                    </Container>
                                  </Card>
                                </Link>
                              );
                            })}
                          </Grid>
                          <br />
                        </>
                      ) : (
                        <h5>
                          {odcs?.length === 0
                            ? 'There are no digital certificates in this collection'
                            : 'Your filter returned 0 digital certificates'}
                        </h5>
                      )}
                    </Container>
                  </div>
                )}
              </>
            )}
          </Flex>,
        ]}
        onLogOut={logout}
        onConnect={open}
        principal={principalId}
      />
    </Flex>
  );
};

export default Marketplace;
