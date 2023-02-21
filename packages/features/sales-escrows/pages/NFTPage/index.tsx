/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/dot-notation */
// import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal';
import { StartAuctionModal } from '../../modals/StartAuctionModal';
import { StartEscrowModal } from '../../modals/StartEscrowModal';
import { eToNumber, getDiffInDays } from '@dapp/utils';
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
// import { tokensContext, useTokensContext } from '@dapp/features-tokens-provider';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';

// const SymbolWithIcon = ({ symbol }: any) =>
//   symbol === 'OGY' ? (
//     <>
//       <OGYIcon
//         style={{
//           verticalAlign: 'middle',
//           width: '20px',
//           height: '20px',
//           marginRight: '3px',
//           borderRadius: '25px',
//           backgroundColor: 'black',
//         }}
//       />{' '}
//       {symbol}
//     </>
//   ) : (
//     <>
//       <ICPIcon
//         style={{
//           verticalAlign: 'middle',
//           width: '20px',
//           height: '20px',
//           marginRight: '3px',
//           borderRadius: '25px',
//           backgroundColor: 'black',
//         }}
//       />{' '}
//       {symbol}
//     </>
// );

export const NFTPage = () => {
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [currentNFT, setCurrentNFT] = useState<any>({});
  const [collectionData, setCollectionData] = useState<any>({});
  const [collectionPreview, setCollectionPreview] = useState<any>({});
  const [openAuction, setOpenAuction] = React.useState(false);
  const [canisterId, setCanisterId] = React.useState('');
  const [dialogAction, setDialogAction] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [modalInitialValues, setModalInitialValues] = React.useState({});
  // const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [roy1, setRoy1] = useState<any>();
  const [roy2, setRoy2] = useState<any>();
  const { open } = useDialog();
  const [saleNft, setSaleNft] = useState<any>();
  // const { tokens } = useTokensContext();
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

  // const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
  //   setExpanded(newExpanded ? panel : false);
  // };

  const params = useParams();

  const currentOpenAuction =
    saleNft?.current_sale[0] ||
    saleNft?.current_sale?.find((sale) => sale?.sale_type?.auction?.status?.hasOwnProperty('open'));

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
      sellerId: currentNFT?.metadata?.Class?.find(
        ({ name }) => name === 'owner',
      ).value.Principal.toText(),
      priceOffer: '0',
    };
    if (type === 'buyNow') {
      modalInitial.priceOffer = (
        parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]) * 1e-8
      ).toString();
    } else if (type === 'bid') {
      const startPrice = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.start_price,
      );
      const min_increase = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.min_increase?.amount,
      );
      const highest_bid = parseInt(currentOpenAuction?.sale_type?.auction?.current_bid_amount);
      modalInitial.priceOffer = eToNumber(
        highest_bid > 0
          ? (parseInt(highest_bid.toString()) + parseInt(min_increase.toString())) / 100_000_000
          : parseInt(startPrice.toString()) / 100_000_000,
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

  const nftEndSale = currentOpenAuction?.sale_type?.auction?.end_date;

  const verifyOwner = currentNFT?.owner;

  const candyValueToString = (candy) => {
    if (candy.value) {
      const v = candy.value;
      return (
        v.Text ||
        v.Nat ||
        v.Nat8 ||
        v.Nat16 ||
        v.Nat32 ||
        v.Nat64 ||
        v.Int ||
        v.Int8 ||
        v.Int16 ||
        v.Int32 ||
        v.Int64 ||
        v.Float ||
        v.Bool ||
        v.Principal?.toText() ||
        ''
      ).toString();
    }
    return '';
  };

  const isCandyClassOrArray = (candy): boolean => {
    return !!(candy.value?.Class || candy.value?.Array);
  };

  const fetchNft = () => {
    actor
      .nft_origyn(params.nft_id)
      .then((r: any) => {
        setIsLoading(false);

        if ('err' in r) throw new Error(Object.keys(r.err)[0]);

        const dataSummary: { [key: string]: string } = {
          tokenID: r?.ok?.metadata?.Class?.find(({ name }) => name === 'id').value.Text || '',
        };

        const appData =
          r?.ok?.metadata?.Class?.find(
            ({ name }) => name === '__apps',
          )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class ||
          '';

        if (appData) {
          appData.forEach((item) => {
            if (!isCandyClassOrArray(item)) {
              dataSummary[item.name] = candyValueToString(item);
            }

            if (item.name === 'custom_properties') {
              item.value.Array.thawed.forEach((customProperty) => {
                if (!isCandyClassOrArray(customProperty)) {
                  dataSummary[customProperty.name] = candyValueToString(customProperty);
                }
              });
            }
          });
        }

        dataSummary.tokenID =
          r?.ok?.metadata?.Class?.find(({ name }) => name === 'id').value.Text || '';

        dataSummary.owner =
          r?.ok?.metadata?.Class?.find(
            ({ name }) => name === 'owner',
          )?.value?.Principal?.toText() || '';
        const royal1 = r?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__system',
        )?.value?.Class?.find(({ name }) => name === 'com.origyn.royalties.primary')?.value?.Array;
        const royal2 = r?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__system',
        )?.value?.Class?.find(({ name }) => name === 'com.origyn.royalties.secondary')?.value
          ?.Array;
        const _nft = r?.ok;
        setRoy2(royal2);
        setRoy1(royal1);
        setCurrentNFT(dataSummary);
        setSaleNft(_nft);
      })
      .catch(console.log);
  };
  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
      OrigynClient.getInstance().init(true, canisterId, { actor });
      getNftCollectionMeta([]).then((r: any) => {
        if (!('err' in r)) {
          setCollectionPreview(
            Object.values(
              r.ok.metadata[0].Class.find(({ name }) => name === 'preview_asset').value,
            )[0],
          );
          setCollectionData(
            r.ok.metadata[0].Class.find(({ name }) => name === '__apps')
              .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
              .value.Class.reduce(
                (arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }),
                {},
              ),
          );
        }
      });
    });

    if (actor) {
      fetchNft();
    }
  }, [actor]);

  return (
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
                    <img
                      style={{ borderRadius: '18px', width: '100%' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                    />
                    <Flex flexFlow="column" gap={8}>
                      <p className="secondary_color">{currentNFT?.owner}</p>
                      <h2>
                        <b>{currentNFT?.display_name || currentNFT?.tokenID}</b>
                      </h2>
                      <br />
                      <ShowMoreBlock btnText="Read More">
                        <p className="secondary_color">{currentNFT?.description}</p>
                      </ShowMoreBlock>
                      <br />
                      <Flex gap={8} align="center">
                        <img
                          src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`}
                          alt=""
                          style={{ width: '32px', height: '32px', borderRadius: '7.5px' }}
                        />
                        <b>{collectionData?.display_name}</b>
                      </Flex>
                      <br />
                      <HR />
                      <Flex fullWidth justify="space-between" align="center">
                        {currentOpenAuction && !currentOpenAuction?.sale_type?.auction?.status.hasOwnProperty('closed') ?
                        (
                          <>
                            <Flex flexFlow="column">
                              <span>Current bid</span>
                              <strong>
                                <TokenIcon
                                  symbol={
                                    currentOpenAuction?.sale_type?.auction?.config?.auction?.token
                                      ?.ic?.symbol
                                  }
                                />
                                {parseFloat(
                                  (
                                    parseInt(
                                      currentOpenAuction?.sale_type?.auction?.current_bid_amount,
                                    ) * 1e-8
                                  ).toString(),
                                ).toFixed(2)}
                              </strong>
                            </Flex>
                            {currentOpenAuction?.sale_type?.auction?.config?.auction?.reserve
                              ?.length > 0 && (
                              <Flex flexFlow="column">
                                <span>Reserve Price</span>
                                <strong>
                                  <TokenIcon
                                    symbol={
                                      currentOpenAuction?.sale_type?.auction?.config?.auction?.token
                                        ?.ic?.symbol
                                    }
                                  />
                                  {parseFloat(
                                    (
                                      parseInt(
                                        currentOpenAuction?.sale_type?.auction?.config?.auction
                                          ?.reserve[0],
                                      ) * 1e-8
                                    ).toString(),
                                  ).toFixed(2)}
                                </strong>
                              </Flex>
                            )}
                            {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now
                              ?.length > 0  && (
                              <Flex flexFlow="column">
                                <span>Buy Now</span>
                                <strong>
                                  <TokenIcon
                                    symbol={
                                      currentOpenAuction?.sale_type?.auction?.config?.auction?.token
                                        ?.ic?.symbol
                                    }
                                  />
                                  {parseFloat(
                                    (
                                      parseInt(
                                        currentOpenAuction?.sale_type?.auction?.config?.auction
                                          ?.buy_now[0],
                                      ) * 1e-8
                                    ).toString(),
                                  ).toFixed(2)}
                                </strong>
                              </Flex>
                            )}
                          </>
                        )
                        : (
                          'Not on sale'
                        )}
                      </Flex>
                      <HR />
                      {nftEndSale && (
                        <p className="secondary_color">
                          {!nftEndSale || BigInt(Number(nftEndSale)) < currentTimeInNanos ? (
                            <span>The sale has ended {getDiffInDays(nftEndSale)}</span>
                          ) : (
                            <span>{getDiffInDays(nftEndSale)}</span>
                          )}
                        </p>
                      )}
                      <br />
                      <Flex gap={8} flexFlow="column">
                        {currentOpenAuction && !currentOpenAuction?.sale_type?.auction?.status.hasOwnProperty('closed') ? (
                          <>
                            {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now
                              ?.length > 0 &&
                              principal != verifyOwner &&
                              (BigInt(Number(nftEndSale || 9 * 1e30)) > currentTimeInNanos ? (
                                <Button btnType="accent" onClick={() => handleOpen('buyNow')}>
                                  Buy Now
                                </Button>
                              ) : (
                                <Button disabled btnType="outlined">
                                  Buy Now
                                </Button>
                              ))}


                            {principal == verifyOwner ? (
                              Number(currentOpenAuction?.sale_type?.auction?.current_bid_amount) ==
                                0 ||
                              (currentOpenAuction?.sale_type?.auction?.status?.hasOwnProperty(
                                'not_started'
                              )) ? (
                                <Button btnType="accent" onClick={handleClickOpenEsc}>
                                  Cancel Sale
                                </Button>
                              ) : 
                              
                              (BigInt(Number(nftEndSale || 9 * 1e30)) < currentTimeInNanos ? (
                                <Button btnType="accent" onClick={handleClickOpenEsc}>
                                  Finish Sale
                                </Button>
                              ) : (
                                <Button disabled btnType="outlined" >
                                  Finish Sale
                                </Button>
                              ))

                              
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
                        ) : principal == verifyOwner ? (
                          <Button btnType="accent" onClick={handleClickOpen}>
                            Start an Auction
                          </Button>
                        ) : (
                          // ((BigInt(parseInt(nftEndSale)) > BigInt(new Date().getTime())) ?
                          // (<Button btnType='primary' disabled onClick={handleEscrow}>Make an Offer</Button>) :
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
                      <Container size="sm" padding="32px" smPadding="16px">
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

                          {mapCustomProperties(currentNFT?.custom_properties).map(
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
                      // eslint-disable-next-line react/jsx-key
                      <Container size="sm" padding="32px" smPadding="16px">
                        <br />
                        <br />
                        <br />
                        <Flex flexFlow="column" gap={18}>
                          <h3>
                            {' '}
                            <b>Primary Royalties </b>
                          </h3>
                          <HR />
                          {roy1?.frozen?.map((nft) => (
                            <div key={nft.Class.find(({ name }) => name === 'tag').value.Text}>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">
                                  {nft.Class.find(({ name }) => name === 'rate').value.Float}
                                </p>
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
                          {roy2?.frozen?.map((nft) => (
                            <div key={nft.Class.find(({ name }) => name === 'tag').value.Text}>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">
                                  {nft.Class.find(({ name }) => name === 'rate').value.Float}
                                </p>
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
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
      <ConfirmSalesActionModal
        openConfirmation={openConfirmation}
        handleClose={handleClose}
        currentToken={currentNFT?.tokenID}
        action={dialogAction}
      />
      <StartAuctionModal
        open={openAuction}
        handleClose={handleClose}
        onSuccess={fetchNft}
        currentToken={currentNFT?.tokenID}
      />
      <StartEscrowModal
        open={openEscrowModal}
        handleClose={handleCloseEscrow}
        nft={saleNft}
        initialValues={modalInitialValues}
        onSuccess={fetchNft}
      />
    </Flex>
  );
};
