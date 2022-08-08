import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PendingIcon from '@mui/icons-material/Pending'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Link,
  Typography,
  Tooltip,
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { NatPrice } from '@dapp/features-components'
import { timeConverter, eToNumber } from '@dapp/utils'
import { ICPIcon, OGYIcon } from '@dapp/common-assets'
import { AuthContext } from '@dapp/features-authentication'
import { StartEscrowModal } from '@dapp/features-sales-escrows'

const SymbolWithIcon = ({ symbol }) => {
  return symbol === 'OGY' ? (
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
  )
}
const NFTPage = () => {
  const { logIn, loggedIn, tokenId, canisterId, principal, actor } =
    useContext(AuthContext)
  const [currentNFT, setCurrentNFT] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false)
  const [modalInitialValues, setModalInitialValues] = React.useState({})

  const params = useParams()

  useEffect(() => {
    if (searchParams.get('nftId')) {
      const initialParameters = searchParams.entries()
      let params = {}
      for (let [key, value] of initialParameters) {
        params[key] = value
      }
      setModalInitialValues(params)
      setOpenEscrowModal(true)
    }

    if (actor) {
      actor
        .nft_origyn(params.nft_id)
        .then((r) => {
          console.log(r)
          setIsLoading(false)
          setCurrentNFT(r.ok)
        })
        .catch(console.log)
    }
  }, [])

  const openAuction = currentNFT?.current_sale?.find((sale) =>
    sale?.sale_type?.auction?.status?.hasOwnProperty('open')
  )
  console.log(
    '🚀 ~ file: index.tsx ~ line 96 ~ NFTPage ~ openAuction',
    openAuction
  )

  const handleOpen = (type) => {
    let modalInitial = {
      nftId: params.nft_id,
      sellerId: currentNFT?.metadata?.Class?.find(
        ({ name }) => name === 'owner'
      ).value.Principal.toText(),
      priceOffer: '0',
    }
    if (type === 'buyNow') {
      modalInitial.priceOffer = eToNumber(
        parseInt(
          openAuction?.sale_type?.auction?.config?.auction?.buy_now[0].toString()
        ) / 100_000_000
      )
    } else if (type === 'bid') {
      const startPrice = parseInt(
        openAuction?.sale_type?.auction?.config?.auction?.start_price
      )
      const min_increase = parseInt(
        openAuction?.sale_type?.auction?.config?.auction?.min_increase?.amount
      )
      const highest_bid = parseInt(
        openAuction?.sale_type?.auction?.current_bid_amount
      )
      modalInitial.priceOffer = eToNumber(
        highest_bid > 0
          ? (parseInt(highest_bid.toString()) +
              parseInt(min_increase.toString())) /
              100_000_000
          : parseInt(startPrice.toString()) / 100_000_000
      )
    }
    setModalInitialValues(modalInitial)
    setOpenEscrowModal(true)
  }

  const handleClose = async (dataChanged = false) => {
    setOpenEscrowModal(false)
    if (dataChanged) {
      //fetchData();
    }
  }

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  return (
    <div>
      <StartEscrowModal
        open={openEscrowModal}
        handleClose={handleClose}
        nft={currentNFT}
        initialValues={modalInitialValues}
      />
      <Grid container spacing={4}>
        <Grid item xs={6} md={4}>
          <img
            width="100%"
            style={{ margin: '0 10px 10px 10px' }}
            src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}`}
          />
        </Grid>
        <Grid
          item
          xs={6}
          md={8}
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
                ({ name }) => name === 'owner'
              ).value.Principal.toText()}
            </Link>
          </Typography>
          <div>
            {openAuction ? (
              <Accordion expanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container direction="row" alignItems="center">
                    <AccessTimeIcon style={{ marginRight: 2 }} /> There is an
                    active auction for this NFT
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Sale ends on{' '}
                    <strong>
                      {' '}
                      {timeConverter(
                        BigInt(
                          parseInt(openAuction?.sale_type?.auction?.end_date)
                        )
                      )}
                    </strong>
                  </Typography>
                  <Typography>
                    Token:{' '}
                    <SymbolWithIcon
                      symbol={
                        openAuction?.sale_type?.auction?.config?.auction?.token
                          ?.ic?.symbol
                      }
                    />
                  </Typography>
                  <Typography>
                    Start price:{' '}
                    <strong>
                      <NatPrice
                        value={
                          openAuction?.sale_type?.auction?.config?.auction
                            ?.start_price
                        }
                      />
                    </strong>
                  </Typography>
                  <Typography>
                    Minimum step:{' '}
                    <strong>
                      <NatPrice
                        value={
                          openAuction?.sale_type?.auction?.config?.auction
                            ?.min_increase?.amount
                        }
                      />
                    </strong>
                  </Typography>
                  <Typography>
                    Highest bid:{' '}
                    <strong>
                      <NatPrice
                        value={
                          openAuction?.sale_type?.auction?.current_bid_amount
                        }
                      />
                    </strong>
                  </Typography>
                  {openAuction?.sale_type?.auction?.config?.auction?.buy_now
                    ?.length > 0 && (
                    <Typography>
                      Buy now:{' '}
                      <strong>
                        <NatPrice
                          value={
                            openAuction?.sale_type?.auction?.config?.auction
                              ?.buy_now[0]
                          }
                        />
                      </strong>
                    </Typography>
                  )}
                  <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                    {openAuction?.sale_type?.auction?.config?.auction?.buy_now
                      ?.length > 0 && (
                      <Tooltip title="This feature is temporarily unavailable. You can still make an offer for an NFT that has no active sale.">
                        <span>
                          <Button
                            disabled
                            variant="contained"
                            onClick={() => handleOpen('buyNow')}
                            startIcon={<ShoppingCartOutlinedIcon />}
                          >
                            Buy now
                          </Button>
                        </span>
                      </Tooltip>
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
              <Accordion expanded={true}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container direction="row" alignItems="center">
                    <PendingIcon style={{ marginRight: 2 }} /> This NFT is not
                    listed for a public sale.
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
          <div hidden>
            <Accordion expanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Grid container direction="row" alignItems="center">
                  <HistoryOutlinedIcon style={{ marginRight: 2 }} /> Transaction
                  history
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                There is no history for this NFT.
              </AccordionDetails>
            </Accordion>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default NFTPage
