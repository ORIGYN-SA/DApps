import { ICPIcon, OGYIcon } from '@dapp/common-assets'
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { LoadingContainer, NatPrice, Table, TokenIcon, WalletTokens } from '@dapp/features-components'
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal'
import { StartAuctionModal } from '../../modals/StartAuctionModal'
import { StartEscrowModal } from '../../modals/StartEscrowModal'
import { eToNumber, IdlStandard, timeConverter } from '@dapp/utils'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Card, Flex, HR, Icons, SecondaryNav,
  Button,
  Container,
  Grid, Banner, TabContent, ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'
import { useDialog } from '@connect2ic/react'
import { TokensContext, useTokensContext } from '@dapp/features-tokens-provider';

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
  const { principal, actor } = useContext(AuthContext)
  const [currentNFT, setCurrentNFT] = useState<any>({})
  const [openAuction, setOpenAuction] = React.useState(false)
  const [canisterId, setCanisterId] = React.useState("")
  const [dialogAction, setDialogAction] = useState<any>()
  const [openConfirmation, setOpenConfirmation] = React.useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false)
  const [modalInitialValues, setModalInitialValues] = React.useState({})
  const [expanded, setExpanded] = React.useState<string | false>('panel1')
  const [roy1, setRoy1] = useState<any>()
  const [roy2, setRoy2] = useState<any>()
  const { open } = useDialog();
  const [saleNft, setSaleNft] = useState<any>();
  const { activeTokens }= useTokensContext();

  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true)
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true)
      setDialogAction('endSale')
    }
  }

  const handleClickOpenEsc = (item, modal='confirmEnd') => {
    console.log('clicked', openConfirmation, dialogAction)
      setOpenConfirmation(true)
      setDialogAction('endSale')
  }

  const handleClose = async () => {
    setOpenAuction(false)
    setOpenConfirmation(false)
  }

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  const params = useParams()
  const currentOpenAuction = saleNft?.current_sale?.find((sale) =>
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

  const handleEscrow = () => {
    setOpenEscrowModal(true)
  }

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false)
    if (dataChanged) {
      // fetchData();
    }
  }

  const verifyOwner = currentNFT?.owner

  useEffect(() => {
    useRoute().then(({canisterId}) => setCanisterId(canisterId))
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
        .then((r: any) => {
          console.log(r)
          setIsLoading(false)

          if ('err' in r)
            throw new Error(Object.keys(r.err)[0])

          const dataObj = r?.ok.metadata.Class.find(({ name }) => name === '__apps')
            .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
            .value.Class.reduce((arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }), {})
          dataObj.tokenID = r?.ok?.metadata?.Class?.find(({ name }) => name === 'id').value.Text

        //TO DO: remove owner from dataObj, create new const so not included in properties for now?
          dataObj.owner = r?.ok?.metadata?.Class?.find(({ name }) => name === 'owner').value.Principal.toText()
          const royal1 = r.ok.metadata.Class.find(({ name }) => name === '__system').value.Class.find(({ name }) => name === 'com.origyn.royalties.primary').value.Array
          const royal2 = r.ok.metadata.Class.find(({ name }) => name === '__system').value.Class.find(({ name }) => name === 'com.origyn.royalties.secondary').value.Array
          const _nft = r?.ok
          setRoy2(royal2)
          setRoy1(royal1)
          setCurrentNFT(dataObj)
          setSaleNft(_nft)
        })
        .catch(console.log)
    }
  }, [])

  if (isLoading || !canisterId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }
  return (
    <Flex fullWidth padding='0' flexFlow='column'>
      <StartEscrowModal
        open={openEscrowModal}
        handleClose={handleCloseEscrow}
        nft={saleNft}
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
                <Container size='md' padding='80px'>
                  <Grid columns={2} gap={120} smGap={16} mdGap={40}>
                    <img
                      style={{ borderRadius: '18px', width: '100%' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                    />
                    <Flex flexFlow='column' gap={8}>
                      <p className="secondary_color">{currentNFT?.collectionid} Collection</p>
                      <h2><b>{currentNFT?.tokenID}</b></h2>
                      <br />
                      <ShowMoreBlock btnText='Read More'>
                        <p className="secondary_color">{currentNFT?.description}</p>
                      </ShowMoreBlock>
                      <br />
                      <div><b>{currentNFT?.collectionid} Collection</b></div>
                      <br/>
                      <HR />
                      <Flex justify='space-between' align='center'>
                        <Flex align='center' gap={8} >
                         
                        { saleNft?.current_sale.length > 0 ? (
                        <Flex flexFlow='row' padding={24}>
                        
                          <Flex flexFlow='column'>
                            <span>Current bid</span>
                              <strong><TokenIcon symbol={activeTokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.current_bid_amount) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex> 
                          <br/>
                          
                           {currentOpenAuction?.sale_type?.auction?.config?.auction?.reserve?.length >
                            0 && (
                           <Flex flexFlow='column'>
                            <span>Reserve Price</span>
                              <strong><TokenIcon symbol={activeTokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.reserve[0]) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex>)}
                          <br/>
                          
                          {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                            0 && (
                          <Flex flexFlow='column'>
                            <span>Buy Now</span>
                              <strong><TokenIcon symbol={activeTokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex>)}                          
                        </Flex>
                        ) : '-'}
                        </Flex>                                                 
                      </Flex>
                      <HR />
                      <br />
                      {
                        currentOpenAuction ? (
                          <div>
                            <Flex flexFlow='row'>

                            {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                            0 && (principal != verifyOwner) && (
                            <Button btnType='accent' style={{marginRight: '16px'}}onClick={()=> handleOpen('buyNow')}>Buy Now</Button>
                            )}
                            {(principal == verifyOwner) ? ( (BigInt(parseInt(currentOpenAuction?.sale_type?.auction?.end_date)) > BigInt(new Date().getTime())) ?
                            <Button btnType='accent' onClick={handleClickOpenEsc}> End Sale </Button> : <Button btnType='outlined' disabled onClick={handleClickOpenEsc}> End Sale </Button>) :
                            <Button btnType='outlined' onClick={()=> handleOpen('bid')}>Place Bid</Button>}
                            

                            </Flex>
                          </div>
                        ) : (  (principal == verifyOwner) ?
                          (<Button btnType='accent' onClick={handleClickOpen}>Start an Auction</Button>) : 
                          ((BigInt(parseInt(currentOpenAuction?.sale_type?.auction?.end_date)) > BigInt(new Date().getTime())) ? 
                          (<Button btnType='primary' disabled onClick={handleEscrow}>Place Bid</Button>) 
                          : (<Button btnType='primary'  onClick={handleEscrow}>Place Bid</Button>))                     
                        )}
                    </Flex>
                  </Grid>
                </Container>
                <Banner bgColor="PRIMARY_1000"  style={{ display: 'block' }} padding='0'>
                  <TabContent
                    fullWidth
                    borderBottom
                    tabs={[
                      { title: 'Properties', id: 'properties' },
                      { title: 'Royalties', id: 'royalties' },
                    ]}
                    content={[
                      <Container size='sm'>
                        <br />
                        <br />
                        <br />
                        <Flex flexFlow='column' gap={16}>
                          {Object.keys(currentNFT).map((k) => (
                            <>
                              <Grid columns={2}>
                                <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
                                <p className="secondary_color">{currentNFT[k].toString()}</p>
                              </Grid>
                              <HR />

                            </>
                          ))}
                        </Flex>
                        <br />
                        <br />
                        <br />
                      </Container>,
                      <Container size='sm'>
                        <br />
                        <br />
                        <br />
                        <Flex flexFlow='column' gap={18}>
                          {roy1?.frozen?.map((nft) => (<>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">{nft.Class.find(({ name }) => name === 'rate').value.Float}</p>
                              </Grid>
                              <HR />
                            </>
                          ))}
                          {roy2?.frozen?.map((nft) => (<>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">{nft.Class.find(({ name }) => name === 'rate').value.Float}</p>
                              </Grid>
                              <HR />
                            </>
                          ))}
                        </Flex>
                        <br />
                        <br />
                        <br />
                      </Container>,
                    ]}
                  />
                </Banner>
              </Flex>}
            </Flex>,
          ]
        }
        onConnect={() => {open(); return {}}}
        principal={principal?.toText()}
      />
      <ConfirmSalesActionModal
        open={openConfirmation}
        handleClose={handleClose}
        currentToken={currentNFT?.tokenID}
        action={dialogAction}
        escrow={undefined}
      />
      <StartAuctionModal
        open={openAuction}
        handleClose={handleClose}
        currentToken={currentNFT?.tokenID}
      />
    </Flex>
  )
}
