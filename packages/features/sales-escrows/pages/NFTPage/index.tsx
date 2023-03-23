/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/dot-notation */
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { ConfirmEndSaleModal } from '../../modals/ConfirmEndSaleModal';
import { StartAuctionModal } from '../../modals/StartAuctionModal';
import { StartEscrowModal } from '../../modals/StartEscrowModal';
import {
  getDiffInDays,
  OdcData,
  OdcDataWithSale,
  parseMetadata,
  parseOdc,
  timeInNanos,
  toLargerUnit,
} from '@dapp/utils';
import { Property } from '@origyn/mintjs';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  HR,
  SecondaryNav,
  Button,
  Container,
  Grid,
  Banner,
  TabContent,
  ShowMoreBlock,
} from '@origyn/origyn-art-ui';
import { useDialog } from '@connect2ic/react';
import { getNftCollectionMeta, OrigynClient } from '@origyn/mintjs';
import { EscrowType } from '../../modals/StartEscrowModal';
import { Principal } from '@dfinity/principal';
import { PlaceholderIcon } from '@dapp/common-assets';
import { OffersPanel } from './components/OffersPanel';

export const NFTPage = () => {
  const debug = useDebug();
  const params = useParams();
  const { open } = useDialog();
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [principalId, setPrincipalId] = useState<string>();
  const [odc, setOdc] = useState<OdcDataWithSale>();
  const [collectionData, setCollectionData] = useState<OdcData>();
  const [openAuctionModal, setOpenAuctionModal] = React.useState(false);
  const [canisterId, setCanisterId] = React.useState('');
  const [onConfirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [escrowType, setEscrowType] = React.useState<EscrowType>();
  const [inProcess, setInProcess] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const nftEndSale = odc?.auction?.end_date;

  const logout = () => {
    handleLogOut();
    fetchData();
  };

  const onAuctionModalOpen = () => {
    setOpenAuctionModal(true);
  };

  const handleClickOpenEsc = () => {
    setConfirmationModalOpen(true);
  };

  const onModalClose = () => {
    setOpenAuctionModal(false);
    setConfirmationModalOpen(false);
  };

  const onOpenEscrowModal = (escrowType: EscrowType) => {
    setEscrowType(escrowType);
    setOpenEscrowModal(true);
  };

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false);
    if (dataChanged) {
      fetchOdc();
    }
  };

  const fetchCollection = async () => {
    const route = await useRoute();
    setCanisterId(route.canisterId);

    OrigynClient.getInstance().init(true, canisterId, { actor });

    const collMetaResp = await getNftCollectionMeta([]);
    debug.log('return value from getNftCollectionMeta([])');
    debug.log(JSON.stringify(collMetaResp, null, 2));

    if (collMetaResp.err) {
      setCollectionData(undefined);
      debug.error(collMetaResp.err);
    } else {
      const collMeta = collMetaResp.ok;
      const metadataClass = collMeta?.metadata?.[0]?.['Class'] as Property[];
      const parsedCollData = parseMetadata(metadataClass);
      setCollectionData(parsedCollData);
    }
  };

  const fetchOdc = async () => {
    const r: any = await actor.nft_origyn(params.nft_id);
    debug.log('return value from actor.nft_origyn(params.nft_id)');
    debug.log(JSON.stringify(r, null, 2));

    if ('err' in r) {
      throw new Error(Object.keys(r.err)[0]);
    }
    setIsLoading(false);

    let parsedOdc: OdcDataWithSale = parseOdc(r['ok']);
    debug.log('parsedOdc');
    debug.log(parsedOdc);

    setOdc(parsedOdc);
  };

  const fetchData = async () => {
    Promise.all([fetchCollection(), fetchOdc()]);
  };

  const getBuyNowPrice = (odc: OdcDataWithSale): string => {
    return toLargerUnit(odc.buyNow, odc.token.decimals).toFixed();
  };

  const getCurrentBidPrice = (odc: OdcDataWithSale): string => {
    return toLargerUnit(odc.currentBid, odc.token.decimals).toFixed();
  };

  const getReservePrice = (odc: OdcDataWithSale): string => {
    return toLargerUnit(odc.reserve, odc.token.decimals).toFixed();
  };

  const endSaleNft = async () => {
    await actor.sale_nft_origyn({ end_sale: params.nft_id });
  };

  useEffect(() => {
    setPrincipalId(
      !principal || principal.toText() === Principal.anonymous().toText() ? '' : principal.toText(),
    );
  }, [principal]);

  useEffect(() => {
    setIsOwner(principalId === odc?.ownerPrincipalId);
  }, [principal, odc]);

  useEffect(() => {
    let intervalId: any;

    // if the auction ended, this function will trigger the end_sale on the current NFT
    // this will be used as a checker
    if (odc?.auctionOpen && nftEndSale <= timeInNanos()) {
      console.log('Ending sale');
      endSaleNft();
    }

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

  return (
    <>
      {odc && (
        <Flex fullWidth padding="0" flexFlow="column">
          <SecondaryNav
            title="Vault"
            tabs={[{ title: 'NFT Details', id: 'nft' }]}
            content={[
              <Flex fullWidth flexFlow="column">
                {isLoading ? (
                  <LoadingContainer margin="24px" />
                ) : (
                  <Flex flexFlow="column">
                    <Container size="md" padding="80px" mdPadding="16px">
                      <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                        {odc?.hasPreviewAsset ? (
                          <img
                            style={{ borderRadius: '18px', width: '100%' }}
                            src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                          />
                        ) : (
                          <Flex align="center" justify="center">
                            <PlaceholderIcon />
                          </Flex>
                        )}
                        <Flex flexFlow="column" gap={8}>
                          <p className="secondary_color">{odc?.ownerPrincipalId}</p>
                          <h2>
                            <b>{odc?.displayName || odc?.id}</b>
                          </h2>
                          <br />
                          <ShowMoreBlock btnText="Read More">
                            <p className="secondary_color">{odc?.description}</p>
                          </ShowMoreBlock>
                          <br />
                          <Flex gap={8} align="center">
                            {collectionData?.hasPreviewAsset ? (
                              <img
                                src={`https://prptl.io/-/${canisterId}/collection/preview`}
                                alt=""
                                style={{ width: '32px', height: '32px', borderRadius: '7.5px' }}
                              />
                            ) : (
                              <PlaceholderIcon width={32} height={32} />
                            )}
                            <b>{collectionData?.displayName}</b>
                          </Flex>
                          <br />
                          <HR />
                          <Flex fullWidth justify="space-between" align="center">
                            {odc?.auctionOpen ? (
                              <>
                                <Flex flexFlow="column">
                                  <span>Current bid</span>
                                  <strong>
                                    <TokenIcon symbol={odc.tokenSymbol} />
                                    {getCurrentBidPrice(odc)}
                                  </strong>
                                </Flex>

                                <Flex flexFlow="column">
                                  <span>Reserve Price</span>
                                  <strong>
                                    <TokenIcon symbol={odc.tokenSymbol} />
                                    {getReservePrice(odc)}
                                  </strong>
                                </Flex>
                                {odc?.buyNow && (
                                  <Flex flexFlow="column">
                                    <span>Buy Now</span>
                                    <strong>
                                      <TokenIcon symbol={odc.tokenSymbol} />
                                      {getBuyNowPrice(odc)}
                                    </strong>
                                  </Flex>
                                )}
                              </>
                            ) : (
                              'Not on sale'
                            )}
                          </Flex>
                          <HR />
                          {odc?.auctionOpen && (
                            <p className="secondary_color">
                              {!nftEndSale || nftEndSale < timeInNanos() ? (
                                <span>The sale has ended {getDiffInDays(nftEndSale)}</span>
                              ) : (
                                <span>{getDiffInDays(nftEndSale)}</span>
                              )}
                            </p>
                          )}
                          <br />
                          {principalId && (
                            <Flex gap={8} flexFlow="column">
                              {odc?.auctionOpen ? (
                                <>
                                  {odc?.buyNow && !isOwner && (
                                    <Button
                                      btnType="accent"
                                      onClick={() => onOpenEscrowModal('BuyNow')}
                                      disabled={inProcess}
                                    >
                                      Buy Now
                                    </Button>
                                  )}

                                  {isOwner ? (
                                    odc.currentBid == 0 || odc.auctionNotStarted ? (
                                      <Button
                                        btnType="accent"
                                        onClick={handleClickOpenEsc}
                                        disabled={inProcess}
                                      >
                                        Cancel Sale
                                      </Button>
                                    ) : BigInt(Number(nftEndSale || 9 * 1e30)) < timeInNanos() ? (
                                      <Button
                                        btnType="accent"
                                        onClick={handleClickOpenEsc}
                                        disabled={inProcess}
                                      >
                                        Finish Sale
                                      </Button>
                                    ) : (
                                      <Button disabled btnType="outlined">
                                        Finish Sale
                                      </Button>
                                    )
                                  ) : BigInt(Number(nftEndSale || 9 * 1e30)) > timeInNanos() ? (
                                    <Button
                                      btnType="outlined"
                                      onClick={() => onOpenEscrowModal('Bid')}
                                      disabled={inProcess}
                                    >
                                      Place Bid
                                    </Button>
                                  ) : (
                                    <Button disabled btnType="outlined">
                                      Place Bid
                                    </Button>
                                  )}
                                </>
                              ) : isOwner ? (
                                <Button
                                  btnType="accent"
                                  onClick={onAuctionModalOpen}
                                  disabled={inProcess}
                                >
                                  Start an Auction
                                </Button>
                              ) : (
                                <OffersPanel
                                  odc={odc}
                                  onOpenEscrowModal={onOpenEscrowModal}
                                  inProcess={inProcess}
                                />
                              )}
                            </Flex>
                          )}
                        </Flex>
                      </Grid>
                    </Container>
                    <Banner bgColor="PRIMARY_1000" style={{ display: 'block' }} padding="0">
                      <TabContent
                        fullWidth
                        borderBottom
                        tabs={[
                          { title: 'Properties', id: 'properties' },
                          { title: 'Royalties', id: 'royalties' },
                        ]}
                        content={[
                          <Container
                            key="custom-properties"
                            size="sm"
                            padding="32px"
                            smPadding="16px"
                          >
                            <br />
                            <br />
                            <br />
                            <Flex flexFlow="column" gap={16}>
                              {odc.displayProperties.map((p) => (
                                <div key={p.name}>
                                  <Grid columns={2}>
                                    <p>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</p>
                                    <p className="secondary_color">{p.value}</p>
                                  </Grid>
                                  <HR marginTop={16} />
                                </div>
                              ))}
                            </Flex>
                            <br />
                            <br />
                            <br />
                          </Container>,
                          <Container key="royalties" size="sm" padding="32px" smPadding="16px">
                            <br />
                            <br />
                            <br />
                            <Flex flexFlow="column" gap={18}>
                              <h3>
                                {' '}
                                <b>Primary Royalties </b>
                              </h3>
                              <HR />
                              {odc?.primaryRoyalties?.map((royalty) => (
                                <div key={royalty.tag}>
                                  <Grid columns={2}>
                                    <p>{royalty.tag}</p>
                                    <p className="secondary_color">{royalty.rate}</p>
                                  </Grid>
                                  <HR marginTop={18} />
                                </div>
                              ))}
                              <br />
                              <h3>
                                {' '}
                                <b>Secondary Royalties</b>{' '}
                              </h3>
                              <HR />
                              {odc?.secondaryRoyalties?.map((royalty) => (
                                <div key={royalty.tag}>
                                  <Grid columns={2}>
                                    <p>{royalty.tag}</p>
                                    <p className="secondary_color">{royalty.rate}</p>
                                  </Grid>
                                  <HR marginTop={18} />
                                </div>
                              ))}
                            </Flex>
                            <br />
                            <br />
                            <br />
                          </Container>,
                        ]}
                      />
                    </Banner>
                  </Flex>
                )}
              </Flex>,
            ]}
            onLogOut={logout}
            onConnect={open}
            principal={principalId}
          />

          {onConfirmationModalOpen && (
            <ConfirmEndSaleModal
              onModalOpen={onConfirmationModalOpen}
              onModalClose={onModalClose}
              currentToken={odc?.id}
              onSaleCancelled={fetchData}
              onProcessing={setInProcess}
            />
          )}
          {openAuctionModal && (
            <StartAuctionModal
              open={openAuctionModal}
              onClose={onModalClose}
              onSuccess={fetchOdc}
              currentToken={odc?.id}
              onProcessing={setInProcess}
            />
          )}
          {openEscrowModal && (
            <StartEscrowModal
              open={openEscrowModal}
              onClose={handleCloseEscrow}
              odc={odc}
              escrowType={escrowType}
              onSuccess={fetchOdc}
              onProcessing={setInProcess}
            />
          )}
        </Flex>
      )}
    </>
  );
};
