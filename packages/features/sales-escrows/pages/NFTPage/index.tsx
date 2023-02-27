/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/dot-notation */
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal';
import { StartAuctionModal } from '../../modals/StartAuctionModal';
import { StartEscrowModal } from '../../modals/StartEscrowModal';
import {
  eToNumber,
  getDiffInDays,
  OdcData,
  OdcDataWithSale,
  parseMetadata,
  parseOdc,
  Property,
} from '@dapp/utils';
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

export const NFTPage = () => {
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [principalId, setPrincipalId] = useState<string>();
  const [currentNFT, setCurrentNFT] = useState<OdcDataWithSale>();
  const [collectionData, setCollectionData] = useState<OdcData>();
  const [openAuction, setOpenAuction] = React.useState(false);
  const [canisterId, setCanisterId] = React.useState('');
  const [dialogAction, setDialogAction] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [modalInitialValues, setModalInitialValues] = React.useState({});
  const { open } = useDialog();
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

  const mapCustomProperties = (customProperties) => {
    if (!customProperties) return [];

    if (customProperties?.Thawed?.length > 0) {
      return customProperties.Thawed.map((property) => ({
        name: property.name,
        value: property.value.Text,
      }));
    }
    return [];
  };

  const handleOpen = (type) => {
    const modalInitial = {
      nftId: params.nft_id,
      sellerId: currentNFT.ownerPrincipalId,
      priceOffer: '0',
    };

    if (type === 'buyNow') {
      modalInitial.priceOffer = (currentNFT.buyNow * 1e-8).toString();
    } else if (type === 'bid') {
      modalInitial.priceOffer = eToNumber(
        currentNFT.currentBid > 0
          ? (currentNFT.currentBid + currentNFT.minIncreaseAmount) / 100_000_000
          : currentNFT.startPrice / 100_000_000,
      );
    }

    setModalInitialValues(modalInitial);
    setOpenEscrowModal(true);
  };

  const handleEscrow = () => {
    setOpenEscrowModal(true);
  };

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false);
    if (dataChanged) {
      fetchNft();
    }
  };

  const currentTimeInNanos = BigInt(new Date().getTime() * 1e6);

  const nftEndSale = currentNFT?.auction?.end_date;

  const verifyOwner = currentNFT?.ownerPrincipalId || '';

  const fetchCollection = async () => {
    const route = await useRoute();
    setCanisterId(route.canisterId);

    OrigynClient.getInstance().init(true, canisterId, { actor });

    const collMetaResp = await getNftCollectionMeta([]);
    if (collMetaResp.err) {
      console.log(collMetaResp.err);
      setCollectionData(undefined);
    } else {
      const collMeta = collMetaResp.ok;
      const metadataClass = collMeta?.metadata?.[0]?.Class as Property[];
      setCollectionData(parseMetadata(metadataClass));
    }
  };

  const fetchNft = async () => {
    const r: any = await actor.nft_origyn(params.nft_id);
    if ('err' in r) {
      throw new Error(Object.keys(r.err)[0]);
    }
    setIsLoading(false);

    let odc: OdcDataWithSale = parseOdc(r['ok']);
    setCurrentNFT(odc);
  };

  useEffect(() => {
    setPrincipalId(principal?.toText() || '');
  }, [principal]);

  useEffect(() => {
    if (actor) {
      Promise.all([fetchCollection(), fetchNft()]);
    }
  }, [actor]);

  return (
    <>
      {currentNFT && (
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
                        {currentNFT?.hasPreviewAsset && (
                          <img
                            style={{ borderRadius: '18px', width: '100%' }}
                            src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                          />
                        )}
                        <Flex flexFlow="column" gap={8}>
                          <p className="secondary_color">{currentNFT?.ownerPrincipalId}</p>
                          <h2>
                            <b>{currentNFT?.displayName || currentNFT?.id}</b>
                          </h2>
                          <br />
                          <ShowMoreBlock btnText="Read More">
                            <p className="secondary_color">{currentNFT?.description}</p>
                          </ShowMoreBlock>
                          <br />
                          <Flex gap={8} align="center">
                            {collectionData?.hasPreviewAsset && (
                              <img
                                src={`https://prptl.io/-/${canisterId}/collection/preview`}
                                alt=""
                                style={{ width: '32px', height: '32px', borderRadius: '7.5px' }}
                              />
                            )}
                            <b>{collectionData?.displayName}</b>
                          </Flex>
                          <br />
                          <HR />
                          <Flex fullWidth justify="space-between" align="center">
                            {currentNFT?.auctionOpen ? (
                              <>
                                <Flex flexFlow="column">
                                  <span>Current bid</span>
                                  <strong>
                                    <TokenIcon symbol={currentNFT.token} />
                                    {parseFloat((currentNFT.currentBid * 1e-8).toString()).toFixed(
                                      2,
                                    )}
                                  </strong>
                                </Flex>
                                {currentNFT?.reserve && (
                                  <Flex flexFlow="column">
                                    <span>Reserve Price</span>
                                    <strong>
                                      <TokenIcon symbol={currentNFT.token} />
                                      {parseFloat((currentNFT.reserve * 1e-8).toString()).toFixed(
                                        2,
                                      )}
                                    </strong>
                                  </Flex>
                                )}
                                {currentNFT?.buyNow && (
                                  <Flex flexFlow="column">
                                    <span>Buy Now</span>
                                    <strong>
                                      <TokenIcon symbol={currentNFT.token} />
                                      {parseFloat((currentNFT.buyNow * 1e-8).toString()).toFixed(2)}
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
                          <Flex gap={8} flexFlow="column">
                            {currentNFT?.auctionOpen ? (
                              <>
                                {currentNFT?.buyNow &&
                                  principalId != verifyOwner &&
                                  (nftEndSale || 9 * 1e30 > currentTimeInNanos ? (
                                    <Button btnType="accent" onClick={() => handleOpen('buyNow')}>
                                      Buy Now
                                    </Button>
                                  ) : (
                                    <Button disabled btnType="outlined">
                                      Buy Now
                                    </Button>
                                  ))}

                                {principalId === verifyOwner ? (
                                  currentNFT.currentBid == 0 || currentNFT.auctionNotStarted ? (
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
                                ) : BigInt(Number(nftEndSale || 9 * 1e30)) > currentTimeInNanos ? (
                                  <Button btnType="outlined" onClick={() => handleOpen('bid')}>
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
                              <Button btnType="accent" onClick={handleEscrow}>
                                Make an Offer
                              </Button>
                            )}
                          </Flex>
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
                              {Object.keys(currentNFT)
                                .filter((k) => k !== 'custom_properties')
                                .map((k) => (
                                  <div key={k}>
                                    <Grid columns={2}>
                                      <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
                                      <p className="secondary_color">{currentNFT[k].toString()}</p>
                                    </Grid>
                                    <HR marginTop={16} />
                                  </div>
                                ))}

                              {mapCustomProperties(currentNFT?.displayPropertes).map(
                                ({ name, value }) => (
                                  <div key={name}>
                                    <Grid columns={2}>
                                      <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
                                      <p className="secondary_color">{value}</p>
                                    </Grid>
                                    <HR marginTop={16} />
                                  </div>
                                ),
                              )}
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
                              {currentNFT?.primaryRoyalties?.map((royalty) => (
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
                              {currentNFT?.secondaryRoyalties?.map((royalty) => (
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
            onLogOut={handleLogOut}
            onConnect={open}
            principal={principal.isAnonymous() ? '' : principalId}
          />

          <ConfirmSalesActionModal
            openConfirmation={openConfirmation}
            handleClose={handleClose}
            currentToken={currentNFT?.id}
            action={dialogAction}
          />
          <StartAuctionModal
            open={openAuction}
            handleClose={handleClose}
            onSuccess={fetchNft}
            currentToken={currentNFT?.id}
          />
          <StartEscrowModal
            open={openEscrowModal}
            handleClose={handleCloseEscrow}
            nft={currentNFT}
            initialValues={modalInitialValues}
            onSuccess={fetchNft}
          />
        </Flex>
      )}
    </>
  );
};
