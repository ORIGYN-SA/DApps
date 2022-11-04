import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { AuthContext, getCanisterId } from '@dapp/features-authentication'
import { NatPrice } from '@dapp/features-components';
import {
  ConfirmSalesActionModal,
  StartAuctionModal,
  StartEscrowModal,
} from '@dapp/features-sales-escrows';
import { eToNumber, timeConverter } from '@dapp/utils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const SymbolWithIcon = ({ symbol }: any) =>
  symbol === 'OGY' ? (
    <>
      <OGYIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  ) : (
    <>
      <ICPIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  );
export const NFTPage = () => {
  const { principal, actor } = useContext(AuthContext);
  const [currentNFT, setCurrentNFT] = useState<any>({});
  const [canisterId, setCanisterId] = useState("");
  const [openAuction, setOpenAuction] = React.useState(false);
  const [dialogAction, setDialogAction] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [modalInitialValues, setModalInitialValues] = React.useState({});
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true);
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true);
      setDialogAction('endSale');
    }
  };

  const handleClose = async () => {
    setOpenAuction(false);
    setOpenConfirmation(false);
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const params = useParams();
  const currentOpenAuction = currentNFT?.current_sale?.find((sale) =>
    sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
  );

  const handleOpen = (type) => {
    const modalInitial = {
      nftId: params.nft_id,
      sellerId: currentNFT?.metadata?.Class?.find(
        ({ name }) => name === 'owner',
      ).value.Principal.toText(),
      priceOffer: '0',
    };
    if (type === 'buyNow') {
      modalInitial.priceOffer = eToNumber(
        parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0].toString()) /
          100_000_000,
      );
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

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false);
    if (dataChanged) {
      // fetchData();
    }
  };

  useEffect(() => {
    if (searchParams.get('nftId')) {
      const initialParameters = searchParams.entries();
      const params = {};
      for (const [key, value] of initialParameters) {
        params[key] = value;
      }
      setModalInitialValues(params);
      setOpenEscrowModal(true);
    }

    if (actor) {
      actor
        .nft_origyn(params.nft_id)
        .then((r) => {
          console.log(r);
          setIsLoading(false);
          setCurrentNFT(r.ok);
        })
        .catch(console.log);
    }
  }, [actor]);

  useEffect(() => {
    getCanisterId().then((r) => {
      setCanisterId(r);
    });
  }, []);

  if (isLoading || !canisterId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      <StartEscrowModal
        open={openEscrowModal}
        handleClose={handleCloseEscrow}
        nft={currentNFT}
        initialValues={modalInitialValues}
      />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={6} md={5}>
            <img
              width="100%"
              style={{ margin: '0 10px 10px 10px' }}
              src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
            />
            <div>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>Description</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {currentNFT?.metadata?.Class?.find(({ name }) => name === 'description')?.value
                      ?.Text || <b>No description provided</b>}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                  <Typography>Properties</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {currentNFT?.metadata?.Class?.find(({ name }) => name === '__apps')
                      ?.value?.Array?.thawed[0].Class.find(({ name }) => name === 'data')
                      .value.Class.map(({ name, value, index }) => (
                        <div key={`${name}+${index}`}>
                          {name}: <b>{Object.values(value)[0].toString()}</b>
                        </div>
                      )) || <b>No properties available</b>}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
          <Grid
            item
            xs={6}
            md={7}
            style={{
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5">{params.nft_id}</Typography>
            <Typography>
              Owned by{' '}
              <Link href="#">
                {currentNFT?.metadata?.Class?.find(
                  ({ name }) => name === 'owner',
                ).value.Principal.toText()}
              </Link>
            </Typography>
            {currentNFT?.metadata?.Class?.find(
              ({ name }) => name === 'owner',
            ).value.Principal.toText() === principal?.toText() ? (
              <div>
                {currentOpenAuction ? (
                  <Accordion expanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container direction="row" alignItems="center">
                        <AccessTimeIcon style={{ marginRight: 2 }} /> There is an active auction for
                        this NFT
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Sale ends on{' '}
                        <strong>
                          {' '}
                          {timeConverter(
                            BigInt(parseInt(currentOpenAuction?.sale_type?.auction?.end_date)),
                          )}
                        </strong>
                      </Typography>
                      <Typography>
                        Token:{' '}
                        <SymbolWithIcon
                          symbol={
                            currentOpenAuction?.sale_type?.auction?.config?.auction?.token?.ic
                              ?.symbol
                          }
                        />
                      </Typography>
                      <Typography>
                        Start price:{' '}
                        <strong>
                          <NatPrice
                            value={
                              currentOpenAuction?.sale_type?.auction?.config?.auction?.start_price
                            }
                          />
                        </strong>
                      </Typography>
                      <Typography>
                        Minimum step:{' '}
                        <strong>
                          <NatPrice
                            value={
                              currentOpenAuction?.sale_type?.auction?.config?.auction?.min_increase
                                ?.amount
                            }
                          />
                        </strong>
                      </Typography>
                      <Typography>
                        Highest bid:{' '}
                        <strong>
                          <NatPrice
                            value={currentOpenAuction?.sale_type?.auction?.current_bid_amount}
                          />
                        </strong>
                      </Typography>
                      {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                        0 && (
                        <Typography>
                          Buy now:{' '}
                          <strong>
                            <NatPrice
                              value={
                                currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]
                              }
                            />
                          </strong>
                        </Typography>
                      )}
                      <div style={{ display: 'flex', gap: 5, marginTop: 5 }} />
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <Accordion expanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container direction="row" alignItems="center">
                        <PendingIcon style={{ marginRight: 2 }} /> This NFT is not listed for a
                        public sale.
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      You can start an Auction for this NFT.
                      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                        <Button
                          variant="outlined"
                          onClick={handleClickOpen}
                          startIcon={<LocalOfferOutlinedIcon />}
                        >
                          Start Auction
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )}
              </div>
            ) : (
              <div>
                {currentOpenAuction ? (
                  <Accordion expanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container direction="row" alignItems="center">
                        <AccessTimeIcon style={{ marginRight: 2 }} /> There is an active auction for
                        this NFT
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Sale ends on{' '}
                        <strong>
                          {' '}
                          {timeConverter(
                            BigInt(parseInt(currentOpenAuction?.sale_type?.auction?.end_date)),
                          )}
                        </strong>
                      </Typography>
                      <Typography>
                        Token:{' '}
                        <SymbolWithIcon
                          symbol={
                            currentOpenAuction?.sale_type?.auction?.config?.auction?.token?.ic
                              ?.symbol
                          }
                        />
                      </Typography>
                      <Typography>
                        Start price:{' '}
                        <strong>
                          <NatPrice
                            value={
                              currentOpenAuction?.sale_type?.auction?.config?.auction?.start_price
                            }
                          />
                        </strong>
                      </Typography>
                      <Typography>
                        Minimum step:{' '}
                        <strong>
                          <NatPrice
                            value={
                              currentOpenAuction?.sale_type?.auction?.config?.auction?.min_increase
                                ?.amount
                            }
                          />
                        </strong>
                      </Typography>
                      <Typography>
                        Highest bid:{' '}
                        <strong>
                          <NatPrice
                            value={currentOpenAuction?.sale_type?.auction?.current_bid_amount}
                          />
                        </strong>
                      </Typography>
                      {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                        0 && (
                        <Typography>
                          Buy now:{' '}
                          <strong>
                            <NatPrice
                              value={
                                currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]
                              }
                            />
                          </strong>
                        </Typography>
                      )}
                      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                        {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                          0 && (
                          <Button
                            variant="contained"
                            onClick={() => handleOpen('buyNow')}
                            startIcon={<ShoppingCartOutlinedIcon />}
                          >
                            Buy now
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          onClick={() => handleOpen('bid')}
                          startIcon={<LocalOfferOutlinedIcon />}
                        >
                          Make a bid
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <Accordion expanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container direction="row" alignItems="center">
                        <PendingIcon style={{ marginRight: 2 }} /> This NFT is not listed for a
                        public sale.
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      You can still make an offer for this NFT by sending an escrow.
                      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                        <Button
                          variant="outlined"
                          onClick={handleOpen}
                          startIcon={<LocalOfferOutlinedIcon />}
                        >
                          Make an offer
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )}
              </div>
            )}
            <div hidden>
              <Accordion expanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Grid container direction="row" alignItems="center">
                    <HistoryOutlinedIcon style={{ marginRight: 2 }} /> Transaction history
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>There is no history for this NFT.</AccordionDetails>
              </Accordion>
            </div>
          </Grid>
        </Grid>
        <ConfirmSalesActionModal
          open={openConfirmation}
          handleClose={handleClose}
          currentToken={currentNFT}
          action={dialogAction}
        />
        <StartAuctionModal
          open={openAuction}
          handleClose={handleClose}
          currentToken={currentNFT?.metadata}
        />
      </Container>
    </div>
  );
};
