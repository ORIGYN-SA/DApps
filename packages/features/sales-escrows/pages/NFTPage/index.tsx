import { ICPIcon, OGYIcon } from '@dapp/common-assets'
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { LoadingContainer, NatPrice, Table, TokenIcon, WalletTokens } from '@dapp/features-components'
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal'
import { StartAuctionModal } from '../../modals/StartAuctionModal'
import { StartEscrowModal } from '../../modals/StartEscrowModal'
import { eToNumber, getDiffInDays, IdlStandard, timeConverter } from '@dapp/utils'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card, Flex, HR, Icons, SecondaryNav,
  Button,
  Container,
  Grid, Banner, TabContent, ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'
import { useDialog } from '@connect2ic/react'
import { TokensContext, useTokensContext } from '@dapp/features-tokens-provider';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs'

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
  const { principal, actor, handleLogOut } = useContext(AuthContext)
  const [currentNFT, setCurrentNFT] = useState<any>({})
  const [collectionData, setCollectionData] = useState<any>({})
  const [collectionPreview, setCollectionPreview] = useState<any>({})
  const [openAuction, setOpenAuction] = React.useState(false)
  const [canisterId, setCanisterId] = React.useState("")
  const [dialogAction, setDialogAction] = useState<any>()
  const [openConfirmation, setOpenConfirmation] = React.useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false)
  const [modalInitialValues, setModalInitialValues] = React.useState({})
  const [expanded, setExpanded] = React.useState<string | false>('panel1')
  const [roy1, setRoy1] = useState<any>()
  const [roy2, setRoy2] = useState<any>()
  const { open } = useDialog();
  const [saleNft, setSaleNft] = useState<any>();
  const { tokens }= useTokensContext();
  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true)
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true)
      setDialogAction('endSale')
    }
  }

  const handleClickOpenEsc = () => {
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
      modalInitial.priceOffer = (parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]) * 1e-8).toString()
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

  const fetchNft = () => {
    actor
      .nft_origyn(params.nft_id)
      .then((r: any) => {
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
  useEffect(() => {
    useRoute().then(({canisterId}) => {
      setCanisterId(canisterId)
      OrigynClient.getInstance().init(true, canisterId)
      getNftCollectionMeta([]).then((r: any) => {
        if ('err' in r) {
        } else {
          setCollectionPreview(
            Object.values(
              r.ok.metadata[0].Class.find(({ name }) => name === 'preview_asset').value,
            )[0],
          )
          setCollectionData(
            r.ok.metadata[0].Class.find(({ name }) => name === '__apps')
              .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
              .value.Class.reduce(
              (arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }),
              {},
            ),
          )
        }
      })
    })

    if (actor) {
      fetchNft()
    }
  }, [actor])

  return (
    <Flex fullWidth padding='0' flexFlow='column'>
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
                <Container size='md' padding='80px' mdPadding="16px">
                  <Grid columns={2} gap={120} smGap={16} mdGap={40}>
                    <img
                      style={{ borderRadius: '18px', width: '100%' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
                    />
                    <Flex flexFlow='column' gap={8}>
                      <p className="secondary_color">{currentNFT?.owner}</p>
                      <h2><b>{currentNFT?.tokenID}</b></h2>
                      <br />
                      <ShowMoreBlock btnText='Read More'>
                        <p className="secondary_color">{currentNFT?.description}</p>
                      </ShowMoreBlock>
                      <br />
                      <Flex gap={8} align="center">
                        <img
                          src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`}
                          alt=''
                          style={{width: "32px", height: "32px", borderRadius: "7.5px"}}
                        />
                        <b>{collectionData?.display_name}</b>
                      </Flex>
                      <br/>
                      <HR />
                      <Flex fullWidth justify='space-between' align='center'>
                        { currentOpenAuction ? (
                        <>
                          <Flex flexFlow='column'>
                            <span>Current bid</span>
                              <strong><TokenIcon symbol={tokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.current_bid_amount) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex>
                           {currentOpenAuction?.sale_type?.auction?.config?.auction?.reserve?.length >
                            0 && (
                           <Flex flexFlow='column'>
                            <span>Reserve Price</span>
                              <strong><TokenIcon symbol={tokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.reserve[0]) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex>)}
                          {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                            0 && (
                          <Flex flexFlow='column'>
                            <span>Buy Now</span>
                              <strong><TokenIcon symbol={tokens['OGY']?.icon} />{parseFloat((parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0]) * 1e-8).toString()).toFixed(2)}</strong>
                          </Flex>)}                          
                        </>
                        ) : 'Not on sale'}
                      </Flex>
                      <HR />
                      {currentOpenAuction?.sale_type?.auction?.end_date && 
                      <p className="secondary_color">{getDiffInDays(currentOpenAuction?.sale_type?.auction?.end_date)}</p>}
                      <br />
                      <Flex gap={8} flexFlow='column'>
                      {
                        currentOpenAuction ? (
                          <>
                            {currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now?.length >
                            0 && (principal != verifyOwner) && (
                            <Button btnType='accent' onClick={()=> handleOpen('buyNow')}>Buy Now</Button>
                            )}
                            {(principal == verifyOwner)
                              ? ( (BigInt(currentOpenAuction?.sale_type?.auction?.end_date) > BigInt(new Date().getTime() *1e8))
                                ? <Button btnType='accent' onClick={handleClickOpenEsc}>Finish Sale</Button>
                                : <Button disabled btnType='outlined'>Finish Sale</Button>)
                              : <Button btnType='outlined' onClick={()=> handleOpen('bid')}>Place Bid</Button>}
                          </>
                        ) : (  (principal == verifyOwner) ?
                          (<Button btnType='accent' onClick={handleClickOpen}>Start an Auction</Button>) : 
                          // ((BigInt(parseInt(currentOpenAuction?.sale_type?.auction?.end_date)) > BigInt(new Date().getTime())) ? 
                          // (<Button btnType='primary' disabled onClick={handleEscrow}>Make an Offer</Button>) : 
                           (<Button btnType='accent'  onClick={handleEscrow}>Make an Offer</Button>)                   
                        )}
                      </Flex>
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
                      <Container size='sm' padding="32px" smPadding="16px">
                        <br />
                        <br />
                        <br />
                        <Flex flexFlow='column' gap={16}>
                          {Object.keys(currentNFT).map((k) => (
                            <div key={k}>
                              <Grid columns={2}>
                                <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
                                <p className="secondary_color">{currentNFT[k].toString()}</p>
                              </Grid>
                              <HR marginTop={16} />
                            </div>
                          ))}
                        </Flex>
                        <br />
                        <br />
                        <br />
                      </Container>,
                      <Container size='sm' padding="32px" smPadding="16px">
                        <br />
                        <br />
                        <br />
                        <Flex flexFlow='column' gap={18}>
                          {roy1?.frozen?.map((nft) => (
                            <div key={nft.Class.find(({ name }) => name === 'tag').value.Text}>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">{nft.Class.find(({ name }) => name === 'rate').value.Float}</p>
                              </Grid>
                              <HR marginTop={18} />
                            </div>
                          ))}
                          {roy2?.frozen?.map((nft) => (
                            <div key={nft.Class.find(({ name }) => name === 'tag').value.Text}>
                              <Grid columns={2}>
                                <p>{nft.Class.find(({ name }) => name === 'tag').value.Text}</p>
                                <p className="secondary_color">{nft.Class.find(({ name }) => name === 'rate').value.Float}</p>
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
              </Flex>}
            </Flex>,
          ]
        }
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === "2vxsx-fae" ? "" : principal?.toText()}
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
  )
}
