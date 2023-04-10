import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDialog } from '@connect2ic/react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { OrigynClient } from '@origyn/mintjs';
import { useDebug } from '@dapp/features-debug-provider';
import { useApi } from '@dapp/common-api';
import { LoadingContainer } from '@dapp/features-components';
import { PlaceholderIcon } from '@dapp/common-assets';
import { OdcDataWithSale, parseOdcs, parseMetadata, toLargerUnit, getRootUrl } from '@dapp/utils';
import { useUserMessages } from '@dapp/features-user-messages';
import { useMarketplace } from '../../components/context';
import {
  Container,
  Flex,
  Button,
  HR,
  Image,
  SecondaryNav,
  ShowMoreBlock,
  theme,
} from '@origyn/origyn-art-ui';
import {
  WebsiteSVG,
  DiscordSVG,
  DistriktSVG,
  DscvrSVG,
  TwitterSVG,
  MediumSVG,
} from '../../../../../features/components/src/SocialMediaSVG';
import Filter from './Filters';
import NFTCards from '../../components/pagination/content'
import Pagination from '../../components/pagination/pages'


const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const SocialMediaButton = styled(Button)`
  background: ${theme.colors.BACKGROUND};
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

    filtered.sort((odc1, odc2) => {
      const price1 = odc1.currentBid || odc1.buyNow;
      const price2 = odc2.currentBid || odc2.buyNow;
      if (sort === 'saleASC') {
        if (odc1.auctionOpen && odc2.auctionOpen) {
          return price1 - price2;
        } else if (odc1.auctionOpen) {
          return -1;
        } else if (odc2.auctionOpen) {
          return 1;
        }
      } else if (sort === 'saleDESC') {
        if (odc1.auctionOpen && odc2.auctionOpen) {
          return price2 - price1;
        } else if (odc1.auctionOpen) {
          return -1;
        } else if (odc2.auctionOpen) {
          return 1;
        }
      }
    });

    if (inputText?.length) {
      filtered = filtered.filter((odc) =>
        (odc.displayName || odc.id)?.toLowerCase().includes(inputText),
      );
    }

    dispatch({ type: 'filteredOdcs', payload: filtered });
  }, [filter, sort, inputText, odcs]);

  //----------pagination-------

  const [currentPage, setCurrentPage] = useState<any>(1);
  const itemsPerPage = 50;

  const totalPages: any = Math.ceil(odcs.length / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = filteredOdcs.slice(start, end);

  console.log('coll', collectionData)

  //---------------end----------

  return (
    <Flex fullWidth padding="0" flexFlow="column">
      <SecondaryNav
        title="Marketplace"
        titleLink={getRootUrl(new URL(window.location.href)) + '/collection/-/marketplace'}
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
                            style={{ width: 110, height: 96 }}
                          />
                        ) : (
                          <Flex align="center" justify="center">
                            <PlaceholderIcon width={110} height={96} />
                          </Flex>
                        )}
                        <Flex flexFlow="column" justify="space-between" fullWidth gap={8}>
                          <Flex
                            flexFlow="row"
                            align="center"
                            fullWidth
                            justify="space-between"
                            smFlexFlow="column"
                          >
                            <h2>
                              <b>{collectionData?.displayName}</b>
                            </h2>
                            <Flex
                              style={{
                                flexWrap: 'wrap',
                                marginTop: '8px',
                                alignContent: 'flex-end',
                              }}
                              gap={8}
                            >
                              {collectionData.socialLinks?.map((link, index) => (
                                <SocialMediaButton
                                  as="a"
                                  iconButton
                                  target="_blank"
                                  href={link.url}
                                  key={index}
                                >
                                  {
                                    {
                                      twitter: <TwitterSVG />,
                                      discord: <DiscordSVG />,
                                      medium: <MediumSVG />,
                                      dscvr: <DscvrSVG />,
                                      distrikt: <DistriktSVG />,
                                      website: <WebsiteSVG />,
                                    }[link.type]
                                  }
                                </SocialMediaButton>
                              ))}
                              <SocialMediaButton
                                as="a"
                                iconButton
                                target="_blank"
                                href={`https://prptl.io/-/${canisterId}/collection/-/ledger`}
                              >
                                <p style={{ color: theme.colors.TEXT }}>Ledger</p>
                              </SocialMediaButton>
                            </Flex>
                          </Flex>

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
                      <Flex flexFlow='column' fullWidth justify='center' align='center'>
                     {/* @ts-ignore */}
                      <NFTCards nftData={currentData} currentPage={currentPage} odcs={odcs}/>
                      {/* @ts-ignore */}
                      <Pagination total={totalPages} current={currentPage} onClick={handlePageClick} />
                      </Flex>
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
