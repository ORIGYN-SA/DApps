import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { PlaceholderImage } from '@dapp/common-assets';
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
import { OdcDataWithSale, parseOdcs, parseMetadata, toLargerUnit } from '@dapp/utils';
import { Principal } from '@dfinity/principal';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Marketplace = () => {
  const { enqueueSnackbar } = useSnackbar() || {};
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [principalId, setPrincipalId] = useState<string>();
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
      const parsedOdcs = parseOdcs(odcDataRaw);
      dispatch({ type: 'odcs', payload: parsedOdcs });
      dispatch({ type: 'filteredOdcs', payload: parsedOdcs });
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
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    document.title = 'Origyn Marketplace';

    const run = async () => {
      const route = await useRoute();
      setCanisterId(route.canisterId);
    };

    run();
  }, []);

  useEffect(() => {
    setPrincipalId(
      !principal || principal.toText() === Principal.anonymous().toText() ? '' : principal.toText(),
    );
  }, [principal]);

  /* Fetch data from canister when the actor reference
   * is ready, then every 5 seconds */
  useEffect(() => {
    let intervalId: any;
    if (actor) {
      fetchData();
      if (!intervalId) {
        intervalId = setInterval(() => {
          fetchData();
        }, 5000);
      }
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
      filtered = filtered.filter((odc) => odc?.displayName?.toLowerCase().includes(inputText));
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
              <LoadingContainer />
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
                            onError={(e) => {
                              e.currentTarget.src = PlaceholderImage;
                            }}
                          />
                        ) : (
                          <Image src={PlaceholderImage} alt="text" style={{ width: 200 }} />
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
                                      <img
                                        style={{ width: '100%' }}
                                        src={`https://${canisterId}.raw.ic0.app/-/${odc?.id}/preview`}
                                        alt=""
                                        onError={(e) => {
                                          e.currentTarget.src = PlaceholderImage;
                                        }}
                                      />
                                    ) : (
                                      <Image
                                        src={PlaceholderImage}
                                        alt="text"
                                        style={{ width: 200 }}
                                      />
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
                                              odc.currentBid === 0 ? (
                                                <>
                                                  {toLargerUnit(
                                                    odc.buyNow,
                                                    Number(odc.token.decimals),
                                                  )}{' '}
                                                  <TokenIcon symbol={odc.tokenSymbol} />
                                                </>
                                              ) : (
                                                <>
                                                  {toLargerUnit(
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
