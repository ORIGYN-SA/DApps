import React from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { useContext, useEffect, useState } from 'react';
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
import Filter from '../../../../wallet/src/pages/Wallet/Filter';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { Link } from 'react-router-dom';
import { useDialog } from '@connect2ic/react';
import styled from 'styled-components';
import { AppData, NftData } from '../../components/context/types';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Marketplace = () => {
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [canisterId, setCanisterId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<any>();
  const [sort, setSort] = useState<any>();
  const [inputText, setInputText] = useState('');
  const { open } = useDialog();
  const { state, dispatch } = useMarketplace();

  const { totalItems, collectionPreview, collectionData, nftData, filteredNftData } = state;

  const getProperty = (properties: any, propertyName: string) => {
    return properties.find(({ name }) => name === propertyName);
  };

  const getTextValue = (properties: any, propertyName: string): string => {
    const p = getProperty(properties, propertyName);
    return p?.value?.Text || '';
  };

  const getAppData = (metadataClass: any): AppData => {
    const apps = getProperty(metadataClass, '__apps');

    const app = apps?.value?.Array?.thawed?.find((c) =>
      c.Class?.find((p) => p.name === 'app_id' && p.value?.Text === 'com.origyn.metadata.general'),
    );

    const data = app?.Class?.find(({ name }) => name === 'data')?.value?.Class?.reduce(
      (obj: Object, val: any) => ({ ...obj, [val.name]: Object.values(val.value)[0] }),
      {},
    );

    data.display_name = data.display_name || '';
    data.description = data.description || '';
    data.custom_properties = data.custom_properties?.thawed || data.custom_properties?.frozen || [];

    return data as AppData;
  };

  const parseNftData = (data: []): NftData[] => {
    const parsed = data.map((item: any): NftData => {
      const nft = item?.ok;

      const properties = nft?.metadata?.Class;
      const appData = getAppData(properties);
      const nftID: string = getTextValue(properties, 'id');

      const openAuction = nft?.current_sale?.find((s) =>
        s?.sale_type?.auction?.status?.hasOwnProperty('open'),
      )?.sale_type?.auction;

      const buyNow: number = Number(openAuction?.config?.auction?.buy_now[0] || 0) / 1e8;
      const currentBid: number = Number(openAuction?.current_bid_amount || 0);
      const token: string = openAuction?.config?.auction?.token?.ic?.symbol || '';

      const data: NftData = {
        nftID,
        onSale: !!openAuction,
        currentBid,
        buyNow,
        token,
        appData,
      };

      return data;
    });

    return parsed;
  };

  const fetchData = async (actor: any) => {
    try {
      // show progress bar on intial load, otherwise fetch silenty
      const stateLoaded = nftData?.length > 0;
      setIsLoading(!stateLoaded);

      OrigynClient.getInstance().init(true, canisterId);

      // get the canister's collection metadata
      const collMetaResp = await getNftCollectionMeta([]);
      if (collMetaResp.err) {
        // TODO: Display error
        console.log(collMetaResp.err);
        return;
      }

      const collMeta = collMetaResp.ok;
      const metadataClass = collMeta?.metadata?.[0]?.Class;

      // set the collection preview image
      const previewAsset = getTextValue(metadataClass, 'preview_asset');
      if (previewAsset) {
        dispatch({ type: 'collectionPreview', payload: previewAsset });
      }

      // set the collection app data
      const appData = getAppData(metadataClass);
      dispatch({ type: 'collectionData', payload: appData });

      // set number of tokens
      const tokenIds = collMeta?.token_ids?.[0] || [];
      dispatch({ type: 'totalItems', payload: tokenIds.length });

      const nftDataRaw = await actor?.nft_batch_origyn(tokenIds);
      if (nftDataRaw.err) {
        // TODO: Display error
        console.log(nftDataRaw.err);
        return;
      }

      // parse the NFT data (metadata and sale info)
      const parsedNftData = parseNftData(nftDataRaw);
      dispatch({ type: 'nftData', payload: parsedNftData });
      dispatch({ type: 'filteredNftData', payload: parsedNftData });
    } catch (err) {
      // TODO: Display error
      console.error(err);
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
    let filtered = nftData;

    switch (filter) {
      case 'onSale':
        filtered = filtered.filter((nft) => nft.onSale);
        break;
      case 'notOnSale':
        filtered = filtered.filter((nft) => !nft.onSale);
        break;
    }

    switch (sort) {
      case 'saleASC':
        filtered = [...filtered].sort((nft, nft2) => {
          return Math.max(nft2.buyNow, nft2.currentBid) - Math.max(nft.buyNow, nft.currentBid);
        });
        break;
      case 'saleDESC':
        filtered = [...filtered].sort((nft, nft2) => {
          return Math.max(nft.buyNow, nft.currentBid) - Math.max(nft2.buyNow, nft2.currentBid);
        });
        break;
    }

    if (inputText !== '') {
      filtered = nftData;
    } else {
      filtered = filtered.filter((nft) =>
        nft?.appData?.display_name?.toLowerCase().includes(inputText),
      );
    }

    dispatch({ type: 'filteredNftData', payload: filtered });
  }, [filter, sort, inputText, nftData]);

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
                    <Image
                      src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`}
                      alt=""
                      style={{ width: 200 }}
                    />
                    <Flex flexFlow="column" justify="space-between" gap={8}>
                      <h2>
                        <b>{collectionData?.display_name}</b>
                      </h2>
                      <p>
                        <span className="secondary_color">Created by </span>
                        <span className="secondary_color">
                          {collectionData?.creator_name
                            ? collectionData?.creator_name
                            : `${collectionData?.creator_principal?.toString()} (no creator_name)`}
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
                    onChangeFilter={setFilter}
                    onChangeSort={setSort}
                    onInput={setInputText}
                  />
                  <br />
                  <br />
                  {nftData?.length > 0 ? (
                    <>
                      <Grid
                        smColumns={1}
                        mdColumns={2}
                        lgColumns={3}
                        xlColumns={4}
                        columns={6}
                        gap={20}
                      >
                        {filteredNftData.map((nft: NftData) => {
                          return (
                            <Link to={`/${nft?.nftID}`} key={nft?.nftID}>
                              <Card
                                flexFlow="column"
                                style={{ overflow: 'hidden', height: '100%' }}
                              >
                                <img
                                  style={{ width: '100%' }}
                                  src={`https://${canisterId}.raw.ic0.app/-/${nft?.nftID}/preview`}
                                  alt=""
                                />
                                <Container style={{ height: '100%' }} size="full" padding="16px">
                                  <Flex
                                    style={{ height: '100%' }}
                                    justify="space-between"
                                    flexFlow="column"
                                    gap={32}
                                  >
                                    <div>
                                      <p style={{ fontSize: '12px', color: '#9A9A9A' }}>
                                        {collectionData?.display_name}
                                      </p>
                                      <p>
                                        <b>{nft?.appData?.display_name}</b>
                                      </p>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '12px', color: '#9A9A9A' }}>Status</p>
                                      <p>
                                        {nft.onSale ? (
                                          nft.currentBid === 0 ? (
                                            <>
                                              {nft.buyNow} <TokenIcon symbol={nft.token} />
                                            </>
                                          ) : (
                                            <>
                                              {nft.currentBid} <TokenIcon symbol={nft.token} />
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
                    <h5>There are no NFTs in this collection</h5>
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
