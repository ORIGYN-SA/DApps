import { Box, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  TabPanel,
  TokenIcon,
  Table,
  NatPrice,
  LoadingContainer,
  WalletTokens,
} from '@dapp/features-components'
import { useDialog } from '@connect2ic/react'
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { useTokensContext } from '@dapp/features-tokens-provider'
import { timeConverter } from '@dapp/utils'
import { ConfirmSalesActionModal } from '@dapp/features-sales-escrows'
import {
  Button,
  Card,
  Flex,
  Grid,
  HR,
  Icons,
  SecondaryNav,
  Select,
  TabContent,
  TextInput,
  Container, ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs'
import TransferTokensModal from '@dapp/features-sales-escrows/modals/TransferTokens'
import ManageEscrowsModal from '@dapp/features-sales-escrows/modals/ManageEscrows'
import Filter from './Filter'

const GuestContainer = () => {
  const { open } = useDialog()

  return (
    <Box
      component='main'
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container maxWidth='md'>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>
            Welcome to the NFT Wallet!
          </h3>
          <Button
            variant='contained'
            onClick={open}
          >
            Connect wallet
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`

const StyledCustomGrid = styled(Grid)`
  grid-template-columns: minmax(0, 2fr) minmax(0, 5fr);
  padding: 24px;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }
`

const StyledBlackCard = styled(Card)`
  background: ${({ theme }) => theme.colors.DARK_BLACK};
`
const StyledBlackItemCard = styled(Card)`
  background: ${({ theme }) => theme.colors.DARK_BLACK};
`

const StyledCollectionImg = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 12px;
`

const WalletPage = () => {
  const activeSalesColumns = [
    { id: 'token_id', label: 'Token ID' },
    { id: 'sale_id', label: 'Sale ID' },
    { id: 'symbol', label: 'Token' },
    { id: 'start_price', label: 'Start Price' },
    { id: 'buy_now', label: 'Buy Now' },
    { id: 'highest_bid', label: 'Highest Bid' },
    { id: 'end_date', label: 'End Date' },
    { id: 'actions', label: 'Actions' },
  ]
  const { loggedIn, principal, actor, activeWalletProvider, handleLogOut } = useContext(AuthContext)
  const [openAuction, setOpenAuction] = React.useState(false)
  const [canisterId, setCanisterId] = React.useState('')
  const [tokenId, setTokenId] = React.useState('')
  const [collectionData, setCollectionData] = React.useState<any>()
  const [collectionPreview, setCollectionPreview] = React.useState<any>()
  const [openConfirmation, setOpenConfirmation] = React.useState(false)
  const [selectdNFT, setSelectdNFT] = React.useState<any>()
  const [selectedEscrow, setSelectedEscrow] = useState<any>()
  const [NFTData, setNFTData] = useState<any>()
  const [filteredNFTData, setFilteredNFTData] = useState<any>([])
  const [filter, setFilter] = useState<any>()
  const [sort, setSort] = useState<any>()
  const [activeEscrows, setActiveEscrows] = useState<any>()
  const [outEscrows, setOutEscrows] = useState<any>()
  const [dialogAction, setDialogAction] = useState<any>()
  const [activeSales, setActiveSales] = useState<any>({
    columns: activeSalesColumns,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showOnlyTokenEntries, setShowOnlyTokenEntries] = useState(true)
  const [openTrx, setOpenTrx] = useState(false)
  const [propsEsc, setPropsEsc] = useState([])

  const { open } = useDialog()

  const { tokens, time } = useTokensContext()
  const { activeTokens } = useTokensContext()

  const handleClickOpen = (item, modal = 'auction') => {
    setSelectdNFT(item.metadata)
    if (modal === 'auction') setOpenAuction(true)
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true)
      setDialogAction('endSale')
    }
  }

  const handleClose = async (dataChanged = false) => {
    setOpenEsc(false)
    setOpenTrx(false)
    setOpenAuction(false)
    setOpenConfirmation(false)
    if (dataChanged) {
      fetchData()
    }
  }

  const withdrawEscrow = async (escrow) => {
    setOpenConfirmation(true)
    setSelectedEscrow(escrow)
    setDialogAction('withdraw')
  }

  const rejectEscrow = async (escrow) => {
    setOpenConfirmation(true)
    setSelectedEscrow(escrow)
    setDialogAction('reject')
  }

  const fetchData = () => {
    if (actor && principal) {
      setIsLoading(true)

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

      actor?.balance_of_nft_origyn({ principal }).then((response) => {
        if ('err' in response) throw new Error(Object.keys(response.err)[0])
        const escrows = response?.ok?.escrow
        const offers = response?.ok?.offers
        const inEscrow: any = []
        const outEscrow: any = []
        if (escrows) {
          escrows.forEach((escrow: any, index) => {
            const esc: any = {}
            esc.token_id = escrow.token_id
            esc.actions = (
              <Button
                onClick={() => withdrawEscrow(response?.ok?.escrow[index])}
                variant='contained'
              >
                Withdraw
              </Button>
            )
            esc.symbol = (
              <>
                <TokenIcon symbol={activeTokens[escrow?.token?.ic?.symbol]?.icon} />
                {escrow?.token?.ic?.symbol}
              </>
            )
            esc.buyer = (
              <Tooltip title={escrow.buyer.principal.toText()}>
                <p>{escrow.buyer.principal.toText().substring(0, 8)}...</p>
              </Tooltip>
            )
            esc.seller = (
              <Tooltip title={escrow.seller.principal.toText()}>
                <p>{escrow.seller.principal.toText().substring(0, 8)}...</p>
              </Tooltip>
            )
            esc.amount = parseFloat((parseInt(escrow.amount) * 1e-8).toString()).toFixed(9)
            outEscrow.push(esc)
          })
        }
        if (offers) {
          // TODO: fix offer type
          offers.forEach((offer: any, index) => {
            const esc: any = {}
            esc.token_id = offer.token_id
            esc.actions = (
              <Button onClick={() => rejectEscrow(response?.ok?.offers[index])} variant='contained'>
                Reject
              </Button>
            )
            esc.symbol = (
              <>
                <TokenIcon symbol={activeTokens[offer?.token?.ic?.symbol]?.icon} />
                {offer?.token?.ic?.symbol}
              </>
            )
            esc.buyer = (
              <Tooltip title={offer.buyer.principal.toText()}>
                <p>{offer.buyer.principal.toText().substring(0, 8)}...</p>
              </Tooltip>
            )
            esc.seller = (
              <Tooltip title={offer.seller.principal.toText()}>
                <p>{offer.seller.principal.toText().substring(0, 8)}...</p>
              </Tooltip>
            )

            esc.amount = parseFloat((parseInt(offer.amount) * 1e-8).toString()).toFixed(9)
            inEscrow.push(esc)
          })
        }
        setActiveEscrows(inEscrow)
        setOutEscrows(outEscrow)


        Promise.all(
          response?.ok?.nfts.map((nft) =>
            actor?.nft_origyn(nft).then((r) => {
              if ('err' in r) throw new Error(Object.keys(r.err)[0])

              return r.ok
            }),
          ),
        )
          .then((data: any) => {
            const rows = []
            for (const item of data) {
              for (const sale of item.current_sale) {
                const { start_price, buy_now, token, ending } =
                sale?.sale_type?.auction?.config?.auction || {}
                const { status, current_bid_amount } = sale?.sale_type?.auction || {}

                if (!status?.hasOwnProperty('closed')) {
                  rows.push({
                    key: sale.token_id,
                    token_id: sale.token_id,
                    sale_id: (
                      <Tooltip title={sale.sale_id}>
                        <p>{sale.sale_id.substring(0, 8)}...</p>
                      </Tooltip>
                    ),

                    symbol: (
                      <>
                        <TokenIcon symbol={activeTokens[token?.ic?.symbol]?.icon} />
                        {token?.ic?.symbol}
                      </>
                    ),
                    start_price: <NatPrice value={start_price} />,
                    buy_now: <NatPrice value={buy_now[0] ?? 0} />,
                    highest_bid: <NatPrice value={current_bid_amount} />,
                    end_date: timeConverter(BigInt(ending.date)),
                    actions:
                      ~~(Date.now() * 1e6) > parseInt(ending.date) ? (
                        <Button onClick={() => handleClickOpen(item, 'confirmEnd')}>
                          End Sale
                        </Button>
                      ) : (
                        '-'
                      ),
                  })
                }
              }
            }

            setActiveSales((prev) => ({ columns: prev.columns, rows }))
            setIsLoading(false)
            const parsedData = data.map((it) => {
              const sale = it?.current_sale[0]?.sale_type?.auction?.current_bid_amount
              const nftID = it.metadata.Class.find(({ name }) => name === 'id').value.Text
              const dataObj = it.metadata.Class.find(({ name }) => name === '__apps')
                .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
                .value.Class.reduce(
                  (arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }),
                  {},
                )
              const filterSale = Number(sale)
              return {
                ...dataObj,
                id: { nftID: nftID, sale: filterSale },
              }
            })

            setNFTData(parsedData)
            setFilteredNFTData(parsedData)
          })
          .catch((err) => {
            setIsLoading(false)
            console.log(err)
          })
      })
    }
  }


  useEffect(() => {
    if (loggedIn) {
      fetchData()
    }
  }, [loggedIn])

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId)
      setTokenId(tokenId)
    })
  }, [])

  const [openEsc, setOpenEsc] = useState(false)

  const FilteredActiveSales =
    tokenId && showOnlyTokenEntries
      ? activeSales?.rows?.filter((nft) => nft.token_id === tokenId)
      : activeSales?.rows

  const FilteredActiveEscrowsIn =
    tokenId && showOnlyTokenEntries
      ? activeEscrows?.in?.data?.filter((nft) => nft.token_id === tokenId)
      : activeEscrows?.in?.data

  const FilteredActiveEscrowsOut =
    tokenId && showOnlyTokenEntries
      ? activeEscrows?.out?.data?.filter((nft) => nft.token_id === tokenId)
      : activeEscrows?.out?.data

  useEffect(() => {
    let filtered = NFTData

    switch (filter) {
      case 'onSale':
        filtered = filtered.filter((nft) => !isNaN(nft?.id?.sale))
        break
      case 'notOnSale':
        filtered = filtered.filter((nft) => isNaN(nft?.id?.sale))
        break
    }

    switch (sort) {
      case 'saleASC':
        filtered = [...filtered]
          .sort((nft, nft2) =>
            isNaN(nft?.id?.sale) ? 1 : isNaN(nft2?.id?.sale) ? -1 : nft?.id?.sale - nft2?.id?.sale)
        break
      case 'saleDESC':
        filtered = [...filtered].sort((nft, nft2) =>
          isNaN(nft2?.id?.sale) ? -1 : isNaN(nft?.id?.sale) ? 1 : nft2?.id?.sale - nft?.id?.sale)
        break
    }

    setFilteredNFTData(filtered)
  }, [filter, sort])

  useEffect(() => {
    if (loggedIn) {
      fetchData()
    }
  }, [loggedIn])

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId)
      setTokenId(tokenId)
    })
  }, [])

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth padding='0' flexFlow='column'>
          <SecondaryNav
            title='Vault'
            tabs={[
              { title: 'Balance', id: 'Balance' },
            ]}
            content={[
              <Flex fullWidth flexFlow='column'>
                <StyledSectionTitle>Vault Dashboard</StyledSectionTitle>
                <HR />
                {isLoading ? (
                  <LoadingContainer />
                ) : (
                  <StyledCustomGrid columns={2} gap={20}>
                    <div>
                      <Card bgColor='NAVIGATION_BACKGROUND' type='outlined' flexFlow='column' padding='24px' gap={16}>
                        <h6>Wallet Balances</h6>
                        <HR />
                        {Object.values(activeTokens).map((k) => (
                          <StyledBlackItemCard align='center' padding='12px' justify='space-between'>
                            <Flex gap={8}>
                              <TokenIcon symbol={k.icon} />
                              {k.symbol}
                            </Flex>
                            <Flex flexFlow='column' align='flex-end'>
                              <p>
                                <b>
                                  {k.balance} {k.symbol}
                                </b>
                              </p>
                              <p className='secondary_color'>${k.balance / 4}</p>
                            </Flex>
                          </StyledBlackItemCard>
                        ))}
                        <p className='small_text secondary_color'>Last Updated: {time}</p>
                        <Button btnType='filled' onClick={() => setOpenTrx(true)}>Transfer Tokens</Button>
                        <WalletTokens>ManageTokens</WalletTokens>
                        <h6>Manage Escrow</h6>
                        <Button textButton onClick={() => setOpenEsc(true)}>
                          {activeEscrows.length > 0 || outEscrows.length > 0 ? 'Assets in Escrow' : 'No assets in Escrow'}
                        </Button>
                        <StyledBlackCard align='center' padding='12px' justify='space-between'>
                          <Flex align='center' gap={12}>
                            <Icons.Wallet width={24} fill='#ffffff' height='auto' />
                            <Flex flexFlow='column'>
                              <p style={{ fontSize: 12, color: '#9A9A9A' }}>
                                {activeWalletProvider.meta.name.charAt(0).toUpperCase() + activeWalletProvider.meta.name.slice(1)}
                              </p>
                              <p>
                                {principal.toText().slice(0, 2)}...{principal.toText().slice(-4)}
                              </p>
                            </Flex>
                          </Flex>
                          <Flex flexFlow='column' align='flex-end'>
                            <Button iconButton size='medium'>
                              <Icons.PDFIcon width={12} height='auto' />
                            </Button>
                          </Flex>
                        </StyledBlackCard>
                      </Card>
                    </div>
                    <div>
                      <Flex align='flex-start' gap={24}>
                        <StyledCollectionImg
                          src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`}
                          alt=''
                        />
                        <Flex flexFlow='column' justify="space-between" gap={8}>
                          <h2><b>{collectionData?.name} Collection</b></h2>
                          <p>
                            <span className='secondary_color'>Created by</span>
                            <span className='secondary_color'>
                              {collectionData?.creator_name
                                ? (
                                  collectionData?.creator_name
                                ) : (
                                  `${collectionData?.creator_principal?.toString()} (no creator_name)`
                                )}
                            </span>
                          </p>
                          <br />
                          <Flex>
                            <Flex flexFlow='column'>
                              <h5>{NFTData?.length}</h5>
                              <p className='secondary_color'>Owned Items</p>
                            </Flex>
                          </Flex>
                          <br />
                          <ShowMoreBlock btnText='Read More'>
                            <p className='secondary_color'>
                              {collectionData?.description}
                            </p>
                          </ShowMoreBlock>
                          <br />
                          <br />
                        </Flex>
                      </Flex>
                      <HR />
                      <br />
                      <Filter
                        onChangeFilter={setFilter}
                        onChangeSort={setSort}
                      />
                      <br />
                      <TransferTokensModal
                        open={openTrx}
                        handleClose={handleClose}
                      />
                      <ManageEscrowsModal
                        open={openEsc}
                        handleClose={handleClose}
                        collection={collectionData}
                      />
                      {NFTData?.length > 0 ? (
                        <Grid
                          smColumns={1}
                          mdColumns={2}
                          lgColumns={3}
                          xlColumns={4}
                          columns={6}
                          gap={20}
                        >
                          {filteredNFTData.map((nft: any) => {
                            return (
                              <Link to={`/${nft.id.nftID}`} key={nft.id.nftID}>
                                <Card flexFlow='column' style={{ overflow: 'hidden', height: '100%' }}>
                                  <img
                                    style={{ width: '100%' }}
                                    src={`https://${canisterId}.raw.ic0.app/-/${nft.id.nftID}/preview`}
                                    alt=''
                                  />
                                  <Container  style={{height: '100%'}} size='full' padding='16px'>
                                    <Flex style={{height: '100%'}} justify="space-between" flexFlow='column' gap={32}>
                                      <div>
                                        <p style={{ fontSize: '12px', color: '#9A9A9A' }}>
                                          {collectionData?.name} Collection
                                        </p>
                                        <p>
                                          <b>{nft['display_name']}</b>
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '12px', color: '#9A9A9A' }}>Status</p>
                                        <p>
                                          {isNaN(nft.id.sale) ? 'No auction started' : nft.id.sale}
                                        </p>
                                      </div>
                                    </Flex>
                                  </Container>
                                </Card>
                              </Link>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Typography variant='h5' style={{ textAlign: 'center' }}>
                          You do not have any NFT in your wallet
                        </Typography>
                      )}
                    </div>
                  </StyledCustomGrid>
                )}
              </Flex>,
              <div>
                {isLoading ? (
                  <LoadingContainer />
                ) : activeSales?.rows?.length > 0 ? (
                  <Table columns={activeSales.columns} rows={FilteredActiveSales} />
                ) : (
                  <Typography variant='h5' style={{ textAlign: 'center' }}>
                    You do not have any active sale at this moment
                  </Typography>
                )}
              </div>,
              <div>
                {isLoading ? (
                  <LoadingContainer />
                ) : activeEscrows?.in?.data?.length > 0 || activeEscrows?.out?.data?.length > 0 ? (
                  <>
                    {activeEscrows?.in?.data?.length > 0 && (
                      <div style={{ marginBottom: 5 }}>
                        Received escrows
                        <Table columns={activeEscrows.in.columns} rows={FilteredActiveEscrowsIn} />
                      </div>
                    )}
                    {activeEscrows?.out?.data?.length > 0 && (
                      <>
                        Sent escrows
                        <Table
                          columns={activeEscrows.out.columns}
                          rows={FilteredActiveEscrowsOut}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant='h5' style={{ textAlign: 'center' }}>
                    You do not have any active escrow at this moment
                  </Typography>
                )}
              </div>,
            ]}
            onLogOut={handleLogOut}
            onConnect={() => {
              open()
              return {}
            }}
            principal={principal?.toText()}
          />
          <ConfirmSalesActionModal
            open={openConfirmation}
            handleClose={handleClose}
            currentToken={selectdNFT}
            action={dialogAction}
            escrow={selectedEscrow}
          />
        </Flex>
      ) : (
        <GuestContainer />
      )}
    </>
  )
}

export default WalletPage
