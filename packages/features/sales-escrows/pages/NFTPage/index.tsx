/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/dot-notation */
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal';
import { StartAuctionModal } from '../../modals/StartAuctionModal';
import { StartEscrowModal } from '../../modals/StartEscrowModal';
import {
  getDiffInDays,
  OdcData,
  OdcDataWithSale,
  parseMetadata,
  parseOdc,
  toLargerUnit,
} from '@dapp/utils';
import { Property } from '@dapp/common-types';
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
} from '@origyn-sa/origyn-art-ui';
import { useDialog } from '@connect2ic/react';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { EscrowType } from '../../modals/StartEscrowModal';
import { Principal } from '@dfinity/principal';
import { PlaceholderImage } from '@dapp/common-assets';

export const NFTPage = () => {
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [principalId, setPrincipalId] = useState<string>();
  const [odc, setOdc] = useState<OdcDataWithSale>();
  const [collectionData, setCollectionData] = useState<OdcData>();
  const [openAuction, setOpenAuction] = React.useState(false);
  const [canisterId, setCanisterId] = React.useState('');
  const [dialogAction, setDialogAction] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [escrowType, setEscrowType] = React.useState<EscrowType>();
  const { open } = useDialog();

  const logout = () => {
    handleLogOut();
    fetchData();
  };

  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true);
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true);
      setDialogAction('endSale');
    }
  };

  const handleClickOpenEsc = () => {
    setOpenConfirmation(true);
    setDialogAction('endSale');
  };

  const handleClose = async () => {
    setOpenAuction(false);
    setOpenConfirmation(false);
  };

  const params = useParams();

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

  const currentTimeInNanos = BigInt(new Date().getTime() * 1e6);

  const nftEndSale = odc?.auction?.end_date;

  const verifyOwner = odc?.ownerPrincipalId || '';

  const fetchCollection = async () => {
    const route = await useRoute();
    setCanisterId(route.canisterId);

    OrigynClient.getInstance().init(true, canisterId, { actor });

    const collMetaResp = await getNftCollectionMeta([]);
    if (collMetaResp.err) {
      setCollectionData(undefined);
      console.log(collMetaResp.err);
    } else {
      const collMeta = collMetaResp.ok;
      const metadataClass = collMeta?.metadata?.[0]?.Class as Property[];
      const parsedCollData = parseMetadata(metadataClass);
      setCollectionData(parsedCollData);
    }
  };

  const fetchOdc = async () => {
    const r: any = await actor.nft_origyn(params.nft_id);
    if ('err' in r) {
      throw new Error(Object.keys(r.err)[0]);
    }
    setIsLoading(false);

    let parsedOdc: OdcDataWithSale = parseOdc(r['ok']);
    setOdc(parsedOdc);
  };

  const fetchData = async () => {
    Promise.all([fetchCollection(), fetchOdc()]);
  };

  useEffect(() => {
    setPrincipalId(
      !principal || principal.toText() === Principal.anonymous().toText() ? '' : principal.toText(),
    );
  }, [principal]);

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
                  <LoadingContainer />
                ) : (
                  <Flex flexFlow="column">
                    <Container size="md" padding="80px" mdPadding="16px">
                      <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                        {odc?.hasPreviewAsset && (
                          <img
                            style={{ borderRadius: '18px', width: '100%' }}
                            src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                          />
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
                              <img
                                src={PlaceholderImage}
                                alt=""
                                style={{ width: '32px', height: '32px', borderRadius: '7.5px' }}
                              />
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
                                    {toLargerUnit(odc.currentBid, Number(odc.token.decimals))}
                                  </strong>
                                </Flex>

                                <Flex flexFlow="column">
                                  <span>Reserve Price</span>
                                  <strong>
                                    <TokenIcon symbol={odc.tokenSymbol} />
                                    {toLargerUnit(odc.reserve, Number(odc.token.decimals))}
                                  </strong>
                                </Flex>
                                {odc?.buyNow && (
                                  <Flex flexFlow="column">
                                    <span>Buy Now</span>
                                    <strong>
                                      <TokenIcon symbol={odc.tokenSymbol} />
                                      {toLargerUnit(odc.buyNow, Number(odc.token.decimals))}
                                    </strong>
                                  </Flex>
                                )}
                              </>
                            ) : (
                              'Not on sale'
                            )}
                          </Flex>
                          <HR />
                          {nftEndSale && (
                            <p className="secondary_color">
                              {!nftEndSale || nftEndSale < currentTimeInNanos ? (
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
                                  {odc?.buyNow &&
                                    principalId != verifyOwner &&
                                    (nftEndSale || 9 * 1e30 > currentTimeInNanos ? (
                                      <Button
                                        btnType="accent"
                                        onClick={() => onOpenEscrowModal('BuyNow')}
                                      >
                                        Buy Now
                                      </Button>
                                    ) : (
                                      <Button disabled btnType="outlined">
                                        Buy Now
                                      </Button>
                                    ))}

                                  {principalId === verifyOwner ? (
                                    odc.currentBid == 0 || odc.auctionNotStarted ? (
                                      <Button btnType="accent" onClick={handleClickOpenEsc}>
                                        Cancel Sale
                                      </Button>
                                    ) : BigInt(Number(nftEndSale || 9 * 1e30)) <
                                      currentTimeInNanos ? (
                                      <Button btnType="accent" onClick={handleClickOpenEsc}>
                                        Finish Sale
                                      </Button>
                                    ) : (
                                      <Button disabled btnType="outlined">
                                        Finish Sale
                                      </Button>
                                    )
                                  ) : BigInt(Number(nftEndSale || 9 * 1e30)) >
                                    currentTimeInNanos ? (
                                    <Button
                                      btnType="outlined"
                                      onClick={() => onOpenEscrowModal('Bid')}
                                    >
                                      Place Bid
                                    </Button>
                                  ) : (
                                    <Button disabled btnType="outlined">
                                      Place Bid
                                    </Button>
                                  )}
                                </>
                              ) : principalId === verifyOwner ? (
                                <Button btnType="accent" onClick={handleClickOpen}>
                                  Start an Auction
                                </Button>
                              ) : (
                                <Button btnType="accent" onClick={() => onOpenEscrowModal('Offer')}>
                                  Make an Offer
                                </Button>
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

          {openConfirmation && (
            <ConfirmSalesActionModal
              openConfirmation={openConfirmation}
              handleClose={handleClose}
              currentToken={odc?.id}
              action={dialogAction}
            />
          )}
          {openAuction && (
            <StartAuctionModal
              open={openAuction}
              handleClose={handleClose}
              onSuccess={fetchOdc}
              currentToken={odc?.id}
            />
          )}
          {openEscrowModal && (
            <StartEscrowModal
              open={openEscrowModal}
              handleClose={handleCloseEscrow}
              odc={odc}
              escrowType={escrowType}
              onSuccess={fetchOdc}
            />
          )}
        </Flex>
      )}
    </>
  );
};
