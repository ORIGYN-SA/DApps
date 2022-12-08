import { ICPIcon, OGYIcon } from '@dapp/common-assets'
import { AuthContext } from '@dapp/features-authentication'
import { LoadingContainer, NatPrice, Table, TokenIcon, WalletTokens } from '@dapp/features-components'
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal'
import { StartAuctionModal } from '../../modals/StartAuctionModal'
import { StartEscrowModal } from '../../modals/StartEscrowModal'
import { eToNumber, IdlStandard, timeConverter } from '@dapp/utils'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PendingIcon from '@mui/icons-material/Pending'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Card, Flex, HR, Icons, SecondaryNav,
  Button,
  Container,
  Grid, Banner, TabContent, CheckboxInput, TextInput, Select,
} from '@origyn-sa/origyn-art-ui'

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
  )
export const NFTPage = () => {
  const { canisterId, principal, actor, logIn } = useContext(AuthContext)
  const [currentNFT, setCurrentNFT] = useState<any>({})
  const [openAuction, setOpenAuction] = React.useState(false)
  const [dialogAction, setDialogAction] = useState<any>()
  const [openConfirmation, setOpenConfirmation] = React.useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false)
  const [modalInitialValues, setModalInitialValues] = React.useState({})
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true)
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true)
      setDialogAction('endSale')
    }
  }

  const handleClose = async () => {
    setOpenAuction(false)
    setOpenConfirmation(false)
  }

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }
  const params = useParams()
  const currentOpenAuction = currentNFT?.current_sale?.find((sale) =>
    sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
  )

  const handleOpen = (type) => {
    const modalInitial = {
      nftId: params.nft_id,
      sellerId: currentNFT?.metadata?.Class?.find(
        ({ name }) => name === 'owner',
      ).value.Principal.toText(),
      priceOffer: '0',
    }
    if (type === 'buyNow') {
      modalInitial.priceOffer = eToNumber(
        parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0].toString()) /
        100_000_000,
      )
    } else if (type === 'bid') {
      const startPrice = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.start_price,
      )
      const min_increase = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.min_increase?.amount,
      )
      const highest_bid = parseInt(currentOpenAuction?.sale_type?.auction?.current_bid_amount)
      modalInitial.priceOffer = eToNumber(
        highest_bid > 0
          ? (parseInt(highest_bid.toString()) + parseInt(min_increase.toString())) / 100_000_000
          : parseInt(startPrice.toString()) / 100_000_000,
      )
    }
    setModalInitialValues(modalInitial)
    setOpenEscrowModal(true)
  }

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false)
    if (dataChanged) {
      // fetchData();
    }
  }

  useEffect(() => {
    if (searchParams.get('nftId')) {
      const initialParameters = searchParams.entries()
      const params = {}
      for (const [key, value] of initialParameters) {
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

          if ('err' in r)
            throw new Error(Object.keys(r.err)[0])

          const dataObj = r?.ok.metadata.Class.find(({name}) => name === '__apps')
            .value.Array.thawed[0].Class.find(({name}) => name === 'data')
            .value.Class.reduce((arr, val) => ({...arr, [val.name]: Object.values(val.value)[0]}), {});
          setCurrentNFT(dataObj)
        })
        .catch(console.log)
    }
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <Banner fullWidth padding='0' flexFlow='column'>
      <StartEscrowModal
        open={openEscrowModal}
        handleClose={handleCloseEscrow}
        nft={currentNFT}
        initialValues={modalInitialValues}
      />

      <SecondaryNav
        title='Vault'
        tabs={[
          { title: 'NFT Details', id: 'nft' },
        ]}
        content={
          [
            <Flex fullWidth flexFlow='column'>
              {isLoading ? (
                <LoadingContainer />
              ) : <Flex flexFlow='column'>
                <Container size="md" padding="80px">
                  <Grid columns={2} gap={120} smGap={16} mdGap={40}>
                    <img
                      style={{ borderRadius: '18px', width: '100%' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                    />
                    <Flex flexFlow="column" gap={8}>
                      <p style={{fontSize: '12px', color: '#9A9A9A'}}>{currentNFT?.collectionid} Collection</p>
                      <h1>{currentNFT?.name}</h1>
                      <br/>
                      <p>{currentNFT?.description}</p>
                      <p style={{color: "#9A9A9A"}}><b>Read More</b></p>
                      <br/>
                      <HR color='MID_GREY'/>
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap={8}><Icons.OrigynIcon width={22} /><b>-</b></Flex>
                        <div><b>{currentNFT?.collectionid}  Collection</b></div>
                      </Flex>
                      <HR color='MID_GREY'/>
                      <br/>
                      {
                        currentOpenAuction ? (
                          <div>
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
                          </div>
                        ) : (
                          <Button onClick={handleClickOpen}>Start an Auction</Button>
                        )
                      }
                    </Flex>
                  </Grid>
                </Container>
                <Banner style={{display: 'block'}} bgColor="rgba(0, 0, 0, 0.3)" padding="0">
                  <TabContent
                    fullWidth
                    borderBottom
                    tabs={[
                      { title: 'Properties', id: 'properties' },
                      { title: 'Royalties', id: 'royalties' },
                    ]}
                    content={[
                      <Container size="sm">
                        <br/>
                        <br/>
                        <br/>
                        <Flex flexFlow="column" gap={16}>
                          {Object.keys(currentNFT).map((k) => (
                            <>
                              <Grid columns={2}>
                                <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
                                <p style={{fontSize: 12, color: "#9A9A9A"}}>{currentNFT[k].toString()}</p>
                              </Grid>
                              <HR color='MID_GREY'/>
                            </>
                          ))}
                        </Flex>
                        <br/>
                        <br/>
                        <br/>
                      </Container>,
                      <Flex flexFlow='column' gap={18} fullWidth>
                          In development
                      </Flex>,
                    ]}
                  />
                </Banner>
              </Flex>}
            </Flex>,
          ]
        }
        onConnect={() => logIn('plug')}
        principal={principal?.toText()}
      />
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
    </Banner>
  )
}
