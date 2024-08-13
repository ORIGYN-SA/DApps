import React, { Fragment, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDialog } from '@connect2ic/react';
import { AuthContext } from '@dapp/features-authentication';
import { OrigynClient, PropertyShared } from '@origyn/mintjs';
import { useDebug } from '@dapp/features-debug-provider';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { useApi } from '@dapp/common-api';
import { LoadingContainer } from '@dapp/features-components';
import { parseOdcs, parseMetadata } from '@dapp/utils';
import { useUserMessages } from '@dapp/features-user-messages';
import { useMarketplace } from '../../components/context';
import { PlaceholderIcon } from "@dapp/common-assets";
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
} from '../../../../../../packages/features/components/src/SocialMediaSVG';
import Filter from './Filters';
import NFTCards from '../../components/pagination/content';
import Pagination from '../../components/pagination/pages';

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const SocialMediaButton = styled(Button)`
  background: ${theme.colors.BACKGROUND};
`;

const Marketplace = () => {
  const debug = useDebug();
  const context = useContext(PerpetualOSContext);
  const { principalId, actor, handleLogOut } = useContext(AuthContext);
  const { getNftBatch, getNftCollectionMeta } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputText, setInputText] = useState('');
  const { open } = useDialog();
  const { state, dispatch } = useMarketplace();
  const { totalItems, collectionData, odcs, filter, sort, filteredOdcs } = state;
  const [currentPage, setCurrentPage] = useState(1);

  const logout = async () => {
    if (handleLogOut) {
      handleLogOut();
    }
    fetchData();
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 50;

  const totalPages: any = Math.ceil((filteredOdcs ?? []).length / itemsPerPage);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = (filteredOdcs ?? []).slice(start, end);

  const fetchData = async () => {
    if (!actor) {
      return;
    }

    try {
      await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });

      // get the canister's collection metadata
      const meta = await getNftCollectionMeta();
      const metadata = meta?.metadata[0] || {};
      const metadataClass: PropertyShared[] =
        'Class' in metadata ? (metadata.Class as PropertyShared[]) : [];
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

  useEffect(() => {
    document.title = 'Origyn Marketplace';
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
    let filtered = odcs ?? [];

    switch (filter) {
      case 'all':
        filtered = odcs ?? [];
        break;
      case 'onSale':
        filtered = (odcs ?? []).filter((odc) => odc.auctionOpen);
        break;
      case 'notOnSale':
        filtered = (odcs ?? []).filter((odc) => !odc.auctionOpen);
        break;
      default:
        filtered = (odcs ?? []).filter((odc) => odc.auctionOpen);
        break;
    }

    filtered.sort((odc1, odc2) => {
      const price1 = odc1.currentBid || odc1.buyNow || 0;
      const price2 = odc2.currentBid || odc2.buyNow || 0;
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
      return 0; // Default value when the prices are undefined
    });

    if (inputText?.length) {
      filtered = filtered.filter((odc) =>
        (odc.displayName || odc.id)?.toLowerCase().includes(inputText),
      );
    }

    dispatch({ type: 'filteredOdcs', payload: filtered });
  }, [filter, sort, inputText, odcs]);

  return (
    <Flex fullWidth flexFlow="column">
      <SecondaryNav
        title="Marketplace"
        titleLink={`${context.canisterUrl}/collection/-/marketplace`}
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
                            src={`${context.assetCanisterUrl}/collection/preview`}
                            alt="text"
                            style={{ width: 110, height: 96 }}
                          />
                        ) : (
                          <Flex align="center" justify="center">
                            <PlaceholderIcon width={96} height={96} />
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
                                href={`${context.canisterUrl}/collection/-/ledger`}
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
                      <Flex flexFlow="column" fullWidth justify="center" align="center">
                        <NFTCards nftData={currentData as any[]} odcs={odcs as any} />
                        <Pagination
                          total={totalPages}
                          current={currentPage}
                          onClick={handlePageClick}
                        />
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
