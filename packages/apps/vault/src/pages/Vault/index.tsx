import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { useApi } from '@dapp/common-api';
import { useVault } from '../../components/context';
import { useDialog } from '@connect2ic/react';
import { TokenIcon, LoadingContainer, WalletTokens } from '@dapp/features-components';
import { useTokensContext, Token } from '@dapp/features-tokens-provider';
import {
  OdcDataWithSale,
  toLargerUnit,
  parseMetadata,
  parseOdcs,
  copyToClipboard,
  getRootUrl,
} from '@dapp/utils';
import { OrigynClient } from '@origyn/mintjs';
import TransferTokensModal from '@dapp/features-sales-escrows/modals/TransferTokens';
import ManageEscrowsModal from '@dapp/features-sales-escrows/modals/ManageEscrows';
import ManageDepositsModal from '@dapp/features-sales-escrows/modals/ManageDepositsModal';
import Filter from './Filter';
import styled from 'styled-components';
import {
  Button,
  Card,
  Flex,
  Grid,
  HR,
  Icons,
  SecondaryNav,
  Container,
  ShowMoreBlock,
  theme,
} from '@origyn/origyn-art-ui';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useUserMessages } from '@dapp/features-user-messages';
import {
  WebsiteSVG,
  DiscordSVG,
  DistriktSVG,
  DscvrSVG,
  TwitterSVG,
  MediumSVG,
} from '../../../../../features/components/src/SocialMediaSVG';

const GuestContainer = () => {
  const { open } = useDialog();

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container maxWidth="md">
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>Welcome to the Origyn Vault</h3>
          <br />
          <Button variant="contained" onClick={open}>
            Connect wallet
          </Button>
        </div>
      </Container>
    </div>
  );
};

const SocialMediaButton = styled(Button)`
  background: ${theme.colors.BACKGROUND};
`;

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const StyledCustomGrid = styled(Grid)`
  grid-template-columns: minmax(0, 2fr) minmax(0, 5fr);
  padding: 24px;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }
`;

const StyledBlackCard = styled(Card)`
  background: ${({ theme }) => theme.colors.DARK_BLACK};
`;

const StyledBlackItemCard = styled(Card)`
  background: ${({ theme }) => theme.colors.DARK_BLACK};
`;

const StyledCollectionImg = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 12px;
`;

const StyledNFTImg = styled.img`
  width: 100%;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 12px;
  height: calc(10vw - 20px);
  position: relative;

  ${({ theme }) => theme.media.xl} {
    height: calc(15vw - 20px);
  }

  ${({ theme }) => theme.media.lg} {
    height: calc(20vw - 20px);
  }

  ${({ theme }) => theme.media.md} {
    height: calc(50vw - 20px);
  }

  ${({ theme }) => theme.media.sm} {
    height: calc(100vw - 20px);
  }
`;

const VaultPage = () => {
  const debug = useDebug();
  const { getNftBatch, getNftCollectionMeta, getNftBalances } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const { loggedIn, principal, principalId, actor, activeWalletProvider, handleLogOut } =
    useContext(AuthContext);
  const [canisterId, setCanisterId] = React.useState('');
  const [openManageDeposit, setOpenManageDeposit] = React.useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [openTrx, setOpenTrx] = useState(false);
  const [showManageEscrowsButton, setShowManageEscrowsButton] = useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};
  const { time, activeTokens } = useTokensContext();
  const { open } = useDialog();
  const { state, dispatch } = useVault();
  const { ownedItems, collectionData, odcs, filter, sort, filteredOdcs } = state;
  const [escrowsModalOpen, setEscrowsModalOpen] = useState(false);

  const logout = async () => {
    handleLogOut();
    fetchData();
  };

  const handleClose = async (dataChanged = false) => {
    setEscrowsModalOpen(false);
    setOpenTrx(false);
    if (dataChanged) {
      fetchData();
    }
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

      if (principal) {
        const vaultBalanceInfo = await getNftBalances(principal);
        debug.log('balance_of_nft_origyn result', vaultBalanceInfo);

        // get list of digital certificates owned by the current user
        const ownedTokenIds = vaultBalanceInfo.nfts || [];
        debug.log('ownedTokenIds', ownedTokenIds);
        const odcs = await getNftBatch(ownedTokenIds);
        const parsedOdcs = parseOdcs(odcs);
        debug.log('parsed odcs', parsedOdcs);
        dispatch({ type: 'ownedItems', payload: ownedTokenIds.length || 0 });
        dispatch({ type: 'odcs', payload: parsedOdcs });

        setShowManageEscrowsButton(
          vaultBalanceInfo.escrow?.length > 0 || vaultBalanceInfo.offers?.length > 0,
        );

        //'balance_of_nft_origyn result' = vaultBalanceInfo

        if (vaultBalanceInfo?.escrow) {
          await Promise.all(vaultBalanceInfo.escrow.map(async (item) => {
            await actor.sale_nft_origyn({ end_sale: item.token_id });
          }));
        }
        
        if (vaultBalanceInfo?.offers) {
          await Promise.all(vaultBalanceInfo.offers.map(async (item) => {
            await actor.sale_nft_origyn({ end_sale: item.token_id });
          }));
        }
        
      } else {
        dispatch({ type: 'odcs', payload: [] });
        dispatch({ type: 'ownedItems', payload: 0 });
        setShowManageEscrowsButton(false);
      }
    } catch (err) {
      showUnexpectedErrorMessage(err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    document.title = 'Origyn Vault';

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
    debug.log('collectionData', collectionData);
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

  useEffect(() => {
    if (actor && loggedIn && principal) {
      fetchData();
    }
  }, [loggedIn, actor, principal]);

  /** Apply filter and sort to list */
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

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  const getPrice = (odc: OdcDataWithSale): string => {
    const price = odc.currentBid
      ? toLargerUnit(odc.currentBid, odc.token.decimals)
      : toLargerUnit(odc.buyNow, odc.token.decimals);
    return price.toFixed();
  };

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth padding="0" flexFlow="column">
          <SecondaryNav
            title="Vault"
            titleLink={getRootUrl(new URL(window.location.href)) + '/collection/-/vault'}
            tabs={[{ title: 'Balance', id: 'Balance' }]}
            content={[
              <Flex fullWidth flexFlow="column" key="secondaryNavContent">
                <StyledSectionTitle>Vault Dashboard</StyledSectionTitle>
                <HR />
                {!isLoaded ? (
                  <LoadingContainer margin="48px" />
                ) : (
                  <StyledCustomGrid columns={2} gap={20}>
                    <div>
                      <Card
                        bgColor="NAVIGATION_BACKGROUND"
                        type="outlined"
                        flexFlow="column"
                        padding="24px"
                        gap={16}
                      >
                        <h6>Wallet Balances</h6>
                        <HR />
                        {Object.values(activeTokens)?.map((token: Token, i) => (
                          <StyledBlackItemCard
                            key={i}
                            align="center"
                            padding="12px"
                            justify="space-between"
                          >
                            <Flex gap={8}>
                              <TokenIcon symbol={token.icon} />
                              {token.symbol}
                            </Flex>
                            <Flex flexFlow="column" align="flex-end">
                              <p>
                                <b>
                                  {token.balance} {token.symbol}
                                </b>
                              </p>
                            </Flex>
                          </StyledBlackItemCard>
                        ))}
                        <p className="small_text secondary_color">Last Updated: {time}</p>
                        {/* <h6>Token Actions</h6> */}
                        <Button btnType="filled" onClick={() => setOpenTrx(true)}>
                          Transfer Tokens
                        </Button>
                        <WalletTokens>Manage Tokens</WalletTokens>

                        <h6>Manage Transactions</h6>
                        <Button btnType="outlined" onClick={() => setOpenManageDeposit(true)}>
                          Manage Deposits
                        </Button>
                        {showManageEscrowsButton ? (
                          <Button btnType="outlined" onClick={() => setEscrowsModalOpen(true)}>
                            Manage Escrows
                          </Button>
                        ) : (
                          <Button disabled>No assets in Escrow</Button>
                        )}

                        {activeWalletProvider && (
                          <StyledBlackCard align="center" padding="12px" justify="space-between">
                            <Flex align="center" gap={12}>
                              <Icons.Wallet width={24} fill="#ffffff" height="100%" />
                              <Flex flexFlow="column">
                                <p style={{ fontSize: 12, color: '#9A9A9A' }}>
                                  {activeWalletProvider.meta.name.charAt(0).toUpperCase() +
                                    activeWalletProvider.meta.name.slice(1)}
                                </p>
                                <p>
                                  {principal.toText().slice(0, 2)}...{principal.toText().slice(-4)}
                                </p>
                              </Flex>
                            </Flex>
                            <Flex flexFlow="column" align="flex-end">
                              <Button
                                iconButton
                                size="medium"
                                onClick={() =>
                                  copyToClipboard(principal.toText(), () => {
                                    enqueueSnackbar('Copied to clipboard', {
                                      variant: 'success',
                                      anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                      },
                                    });
                                  })
                                }
                              >
                                <Icons.CopyIcon width={12} height="100%" />
                              </Button>
                            </Flex>
                          </StyledBlackCard>
                        )}
                      </Card>
                    </div>
                    {collectionData && (
                      <div>
                        <Flex align="flex-start" gap={24}>
                          {collectionData.hasPreviewAsset ? (
                            <StyledCollectionImg
                              src={`https://prptl.io/-/${canisterId}/collection/preview`}
                              alt=""
                            />
                          ) : (
                            <Flex justify="center" align="center" style={{ height: '100%' }}>
                              <PlaceholderIcon width={96} height={96} />
                            </Flex>
                          )}
                          <Flex flexFlow="column" fullWidth justify="space-between" gap={8}>
                            <Flex
                              flexFlow="row"
                              align="center"
                              fullWidth
                              justify="space-between"
                              smFlexFlow="column"
                            >
                              <h2>{collectionData.displayName}</h2>

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
                                  href={`${getRootUrl(
                                    new URL(window.location.href),
                                  )}/collection/-/ledger`}
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
                                <h5>{ownedItems}</h5>
                                <p className="secondary_color">Owned Items</p>
                              </Flex>
                            </Flex>
                            <br />
                            <ShowMoreBlock btnText="Read More">
                              <p>{collectionData.description}</p>
                            </ShowMoreBlock>
                            <br />
                            <br />
                          </Flex>
                        </Flex>
                        <HR />
                        <br />
                        <Filter
                          onChangeFilter={(filterValue: string) =>
                            dispatch({ type: 'filter', payload: filterValue })
                          }
                          onChangeSort={(sortValue: string) =>
                            dispatch({ type: 'sort', payload: sortValue })
                          }
                          onInput={setInputText}
                        />
                        <br />
                        <TransferTokensModal open={openTrx} handleClose={handleClose} />
                        <ManageEscrowsModal
                          open={escrowsModalOpen}
                          handleClose={handleClose}
                          collection={collectionData}
                        />
                        {parseOdcs?.length > 0 ? (
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
                                      bgColor="NAVIGATION_BACKGROUND"
                                    >
                                      {odc.hasPreviewAsset ? (
                                        <StyledNFTImg
                                          src={`https://${canisterId}.raw.ic0.app/-/${odc?.id}/preview`}
                                          alt=""
                                        />
                                      ) : (
                                        <Flex
                                          justify="center"
                                          align="center"
                                          style={{ height: '100%' }}
                                        >
                                          <PlaceholderIcon
                                            width={'100%'}
                                            height={`calc(15vw - 20px)`}
                                          />
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
                                              <b>{odc.displayName || odc.id}</b>
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
                          'There are no digital certificates in your vault'
                        )}
                      </div>
                    )}
                  </StyledCustomGrid>
                )}
              </Flex>,
            ]}
            onLogOut={logout}
            onConnect={open}
            principal={principalId}
          />
          <ManageDepositsModal
            open={openManageDeposit}
            handleClose={() => setOpenManageDeposit(false)}
          />
        </Flex>
      ) : (
        <GuestContainer />
      )}
    </>
  );
};

export default VaultPage;
