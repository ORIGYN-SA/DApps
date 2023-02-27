import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { useMarketplace } from '../../components/context';
import {
  Card,
  Container,
  Flex,
  HR,
  Grid,
  Image,
  SecondaryNav,
  ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui';
import Filter from '../../../../vault/src/pages/Vault/Filter';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { Link } from 'react-router-dom';
import { useDialog } from '@connect2ic/react';
import styled from 'styled-components';
import { OdcDataWithSale, parseOdcs, parseMetadata, currencyToFixed } from '@dapp/utils';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Marketplace = () => {
  const { enqueueSnackbar } = useSnackbar() || {};
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [canisterId, setCanisterId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const { open } = useDialog();
  const { state, dispatch } = useMarketplace();

  const {
    totalItems,
    collectionData,
    odcs: odcData,
    filter,
    sort,
    filteredOdcs: filteredOdcData,
  } = state;

  const fetchData = async (actor: any) => {
    try {
      // show progress bar on intial load, otherwise fetch silenty
      const stateLoaded = odcData?.length > 0;
      setIsLoading(!stateLoaded);

      OrigynClient.getInstance().init(true, canisterId, { actor });

      // get the canister's collection metadata
      const collMetaResp = await getNftCollectionMeta([]);
      if (collMetaResp.err) {
        // TODO: Display error
        console.log(collMetaResp.err);
        return;
      }

      const collMeta = collMetaResp.ok;
      const metadataClass = collMeta?.metadata?.[0]?.Class;
      const collData = parseMetadata(metadataClass);
      dispatch({ type: 'collectionData', payload: collData });

      // set number of tokens
      const tokenIds = collMeta?.token_ids?.[0] || [];
      dispatch({ type: 'totalItems', payload: tokenIds.length });

      // get a list of all digital certificates in the collection
      const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);
      if (odcDataRaw.err) {
        // TODO: Display error
        console.log(odcDataRaw.err);
        return;
      }

      // parse the digital certificate data (metadata and sale info)
      const odcs = parseOdcs(odcDataRaw);
      dispatch({ type: 'odcs', payload: odcs });
      dispatch({ type: 'filteredOdcs', payload: odcs });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err?.message || err, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**  Get canisterId from URL when component loads */
  useEffect(() => {
    document.title = 'Origyn Marketplace';

    const run = async () => {
      const route = await useRoute();
      setCanisterId(route.canisterId);
    };

    run();
  }, []);

  /** Fetch data from canister when the actor reference is ready */
  useEffect(() => {
    if (actor) {
      fetchData(actor);
    }
  }, [actor]);

  /** Apply filter and sort to list */
  useEffect(() => {
    let filtered = odcData;

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
      filtered = filtered.filter((odc) => odc?.displayName?.toLowerCase().includes(inputText));
    }

    dispatch({ type: 'filteredOdcs', payload: filtered });
  }, [filter, sort, inputText, odcData]);

  return (
    <Flex fullWidth padding="0" flexFlow="column">
      <SecondaryNav
        title="Marketplace"
        tabs={[{ title: 'Marketplace', id: 'Marketplace' }]}
        content={[
          <Flex fullWidth flexFlow="column" key="marketplace-nav">
            <StyledSectionTitle>Marketplace Dashboard</StyledSectionTitle>
            <HR />
            {isLoading ? (
              <LoadingContainer />
            ) : (
              <div>
                <Container padding="32px">
                  <Flex align="flex-start" gap={24}>
                    {collectionData.hasPreviewAsset && (
                      <Image
                        src={`https://prptl.io/-/${canisterId}/collection/preview`}
                        alt="text"
                        style={{ width: 200 }}
                      />
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
                        <p className="secondary_color">{collectionData?.description}</p>
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
                  {odcData?.length > 0 ? (
                    <>
                      <Grid
                        smColumns={1}
                        mdColumns={2}
                        lgColumns={3}
                        xlColumns={4}
                        columns={6}
                        gap={20}
                      >
                        {filteredOdcData.map((odc: OdcDataWithSale) => {
                          return (
                            <Link to={`/${odc?.id}`} key={odc?.id}>
                              <Card
                                flexFlow="column"
                                style={{ overflow: 'hidden', height: '100%' }}
                              >
                                {odc.hasPreviewAsset ? (
                                  <img
                                    style={{ width: '100%' }}
                                    src={`https://${canisterId}.raw.ic0.app/-/${odc?.id}/preview`}
                                    alt=""
                                  />
                                ) : (
                                  <img style={{ width: '100%' }} alt="" />
                                )}
                                <Container style={{ height: '100%' }} size="full" padding="16px">
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
                                      <p style={{ fontSize: '12px', color: '#9A9A9A' }}>Status</p>
                                      <p>
                                        {odc.auctionOpen ? (
                                          odc.currentBid === 0 ? (
                                            <>
                                              {currencyToFixed(
                                                odc.buyNow,
                                                Number(odc.token.decimals),
                                              )}{' '}
                                              <TokenIcon symbol={odc.tokenSymbol} />
                                            </>
                                          ) : (
                                            <>
                                              {currencyToFixed(
                                                odc.currentBid,
                                                Number(odc.token.decimals),
                                              )}{' '}
                                              <TokenIcon symbol={odc.tokenSymbol} />
                                            </>
                                          )
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
                    <h5>There are no digital certificates in this collection</h5>
                  )}
                </Container>
              </div>
            )}
          </Flex>,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </Flex>
  );
};

export default Marketplace;
