import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  TabPanel,
  TokenIcon,
  Table,
  NatPrice,
  LoadingContainer,
  WalletTokens,
} from '@dapp/features-components'
import { AuthContext } from '@dapp/features-authentication'
import { useTokensContext } from '@dapp/features-tokens-provider'
import { timeConverter } from '@dapp/utils'
import {
  ConfirmSalesActionModal,
  StartAuctionModal,
} from '@dapp/features-sales-escrows'
import {
  Banner,
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
  Container,
} from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const GuestContainer = () => {
  const { logIn } = useContext(AuthContext)

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
          <Typography align='center' color='textPrimary' variant='h2'>
            Welcome to the NFT Wallet!
          </Typography>
          <Typography align='center' color='textPrimary' variant='subtitle2'>
            Connect to your wallet using a Chrome extension for Plug.
          </Typography>
          <Button
            onClick={() => logIn('plug')}
            startIcon={<AccountBalanceWalletIcon fontSize='small' />}
            variant='contained'
          >
            Connect wallet
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

const StyledSectionTitle = styled.h1`
  margin: 48px 24px;
`

const StyledCustomGrid = styled(Grid)`
  grid-template-columns: 2fr 5fr;
  padding: 24px;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr 2fr;
  }
`

const StyledBlackCard = styled(Card)`
  width: 307px;
  background: ${({theme}) => theme.colors.DARK_BLACK};
  height: 700px;
  margin-left: 20px;
`
const StyledBlackItemCard = styled(Card)`
  width: 259px;
  background: ${({theme}) => theme.colors.DARK_BLACK};
`

const GridMain2NFTS = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledCollectionImg = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 12px;
`

const StyledFilterSelect = styled.input`
  width: 169px;
  min-width: 169px;
  height: 40px;
  min-height: 40px;
  border: 1px solid #242424;
  padding: 9px 16px;
  border-radius: 12px;
  box-sizing: border-box;
  background: transparent;
`

const GridMain = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
`;

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
  const { loggedIn, tokenId, canisterId, principal, actor, logIn, walletType } = useContext(AuthContext)

  const [openAuction, setOpenAuction] = React.useState(false)
  const [collectionData, setCollectionData] = React.useState<any>()
  const [collectionPreview, setCollectionPreview] = React.useState<any>()
  const [openConfirmation, setOpenConfirmation] = React.useState(false)
  const [selectdNFT, setSelectdNFT] = React.useState<any>()
  const [selectedEscrow, setSelectedEscrow] = useState<any>()
  const [NFTData, setNFTData] = useState<any>()
  const [activeEscrows, setActiveEscrows] = useState<any>()
  const [dialogAction, setDialogAction] = useState<any>()
  const [activeSales, setActiveSales] = useState<any>({
    columns: activeSalesColumns,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showOnlyTokenEntries, setShowOnlyTokenEntries] = useState(true)

  const { tokens } = useTokensContext()

  const handleClickOpen = (item, modal = 'auction') => {
    setSelectdNFT(item.metadata)
    if (modal === 'auction') setOpenAuction(true)
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true)
      setDialogAction('endSale')
    }
  }

  const handleClose = async (dataChanged = false) => {
    setOpenAuction(false)
    setOpenConfirmation(false)
    if (dataChanged) {
      fetchData()
    }
  }

  const createTableData = (data) => {
    const columns = [
      { id: 'id', label: 'id' },
      { id: 'preview', label: 'Preview' },
      { id: 'sale', label: 'Active Sale' },
      { id: 'saleStatus', label: 'Sale Status' },
      { id: 'actions', label: 'Actions' },
    ]

    const rows = data?.map((item) => {
      const rows: any = {}
      item?.metadata?.Class?.map((meta) => {
        if (!meta.name.startsWith('__')) {
          if (meta?.value?.Text || meta?.value?.Principal) {
            rows[meta.name] = meta?.value?.Text ?? meta?.value?.Principal.toText()
          }
        }
      })

      const sale_type = item?.current_sale.length > 0 ? item?.current_sale[0].sale_type : {}
      rows.sale = (
        <Tooltip title={item?.current_sale[0]?.sale_id}>
          <p>{item?.current_sale[0]?.sale_id?.substring(0, 8)}...</p>
        </Tooltip>
      ) || 'No sales'
      rows.raw_id = rows.id
      rows.id = <Link to={`#/${rows.id}`}>{rows.id}</Link>
      rows.preview = (
        <img
          src={`https://${canisterId}.raw.ic0.app/-/${rows.raw_id}/preview`}
          style={{ height: '50px', borderRadius: '5px' }}
        />
      )
      rows.saleStatus = Object.keys(sale_type?.auction?.status || {})[0] || 'No sales'

      const isAuctionStarted = !sale_type?.auction?.status?.hasOwnProperty('closed')
        && sale_type?.auction
      // @ts-ignore
      rows.actions = isAuctionStarted ? (
        <span style={{ color: 'orange' }}>AUCTION STARTED</span>
      ) : (
        <Button onClick={() => handleClickOpen(item)}>Start Auction</Button>
      )
      return rows
    })

    return { rows, columns: columns.filter((column) => column) }
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
      actor
        ?.balance_of_nft_origyn({ principal })
        .then((response) => {

          if ('err' in response)
            throw new Error(Object.keys(response.err)[0])
          const escrows = response?.ok?.escrow
          const offers = response?.ok?.offers
          const inEscrow: any = []
          const outEscrow: any = []
          console.log('balance of', response)
          if (escrows) {
            // TODO: fix escrow type
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
                  <TokenIcon symbol={tokens[escrow?.token?.ic?.symbol]?.icon} />
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

              esc.amount = parseFloat(
                (parseInt(escrow.amount) * 1e-8).toString(),
              ).toFixed(9)
              outEscrow.push(esc)
            })
          }
          if (offers) {
            // TODO: fix offer type
            offers.forEach((offer: any, index) => {
              const esc: any = {}
              esc.token_id = offer.token_id
              esc.actions = (
                <Button
                  onClick={() => rejectEscrow(response?.ok?.offers[index])}
                  variant='contained'
                >
                  Reject
                </Button>
              )
              esc.symbol = (
                <>
                  <TokenIcon symbol={tokens[offer?.token?.ic?.symbol]?.icon} />
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

              esc.amount = parseFloat(
                (parseInt(offer.amount) * 1e-8).toString(),
              ).toFixed(9)
              inEscrow.push(esc)
            })
          }
          const inColumns = [
            { id: 'token_id', label: 'Id' },
            { id: 'buyer', label: 'Buyer' },
            { id: 'symbol', label: 'Token' },
            { id: 'amount', label: 'Amount' },
            { id: 'lockDate', label: 'Lock Date' },
            { id: 'actions', label: 'Actions' },
          ]
          const outColumns = [
            { id: 'token_id', label: 'Id' },
            { id: 'seller', label: 'Seller' },
            { id: 'symbol', label: 'Token' },
            { id: 'amount', label: 'Amount' },
            { id: 'lockDate', label: 'Lock Date' },
            { id: 'actions', label: 'Actions' },
          ]
          setActiveEscrows({
            in: { columns: inColumns, data: inEscrow },
            out: { columns: outColumns, data: outEscrow },
          })

          actor?.nft_origyn('').then((r) => {
            if ('err' in r) {
              console.log(r);
            } else {
              if ('Class' in r.ok.metadata) {
                console.log(r.ok.metadata.Class);
                setCollectionPreview(Object.values(r.ok.metadata.Class.find(({name}) => name === 'preview_asset').value)[0])
                setCollectionData(r.ok.metadata.Class.find(({name}) => name === '__apps')
                  .value.Array.thawed[0].Class.find(({name}) => name === 'data')
                  .value.Class.reduce((arr, val) => ({...arr, [val.name]: Object.values(val.value)[0]}), {}));
              }
            }
          })

          Promise.all(
            response?.ok?.nfts.map((nft) => actor?.nft_origyn(nft).then((r) => {
              if ('err' in r)
                throw new Error(Object.keys(r.err)[0])

              return r.ok
            })),
          )
            .then((data: any) => {
              const rows = []
              for (const item of data) {
                for (const sale of item.current_sale) {
                  console.log(sale)
                  const { start_price, buy_now, token, ending } = sale?.sale_type?.auction?.config?.auction || {}
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
                          <TokenIcon symbol={tokens[token?.ic?.symbol]?.icon} />
                          {token?.ic?.symbol}
                        </>
                      ),
                      start_price: <NatPrice value={start_price} />,
                      buy_now: <NatPrice value={buy_now[0] ?? 0} />,
                      highest_bid: <NatPrice value={current_bid_amount} />,
                      end_date: timeConverter(BigInt(ending.date)),
                      actions:
                        ~~(Date.now() * 1e6) > parseInt(ending.date) ? (
                          <Button
                            onClick={() => handleClickOpen(item, 'confirmEnd')}
                          >
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
                const sale = it?.current_sale[0]?.sale_type?.auction?.current_bid_amount;
                const nftID = it.metadata.Class.find(({ name }) => name === 'id').value.Text;
                const dataObj = it.metadata.Class.find(({name}) => name === '__apps')
                  .value.Array.thawed[0].Class.find(({name}) => name === 'data')
                  .value.Class.reduce((arr, val) => ({...arr, [val.name]: Object.values(val.value)[0]}), {});
              const filterSale = Number(sale)
                return {
                  
                  ...dataObj,
                  id: {nftID: nftID, sale: filterSale} 
                }
              });

              console.log('!!!!', data, parsedData);

              setNFTData(parsedData)
            })
            .catch((err) => {
              setIsLoading(false)
              console.log(err)
            })
        })
    }
  }

  useEffect(() => {
    
    console.log('123', collectionData);
    fetchData()
  }, [actor, principal])

  const FilteredNFTData = tokenId && showOnlyTokenEntries
    ? NFTData?.rows?.filter((nft) => nft.raw_id === tokenId)
    : NFTData?.rows

  const FilteredActiveSales = tokenId && showOnlyTokenEntries
    ? activeSales?.rows?.filter((nft) => nft.token_id === tokenId)
    : activeSales?.rows

  const FilteredActiveEscrowsIn = tokenId && showOnlyTokenEntries
    ? activeEscrows?.in?.data?.filter((nft) => nft.token_id === tokenId)
    : activeEscrows?.in?.data

  const FilteredActiveEscrowsOut = tokenId && showOnlyTokenEntries
    ? activeEscrows?.out?.data?.filter((nft) => nft.token_id === tokenId)
    : activeEscrows?.out?.data

  console.log('this is NFTData, ', NFTData)
  return (
    <>
      {loggedIn ? (
        <Banner fullWidth padding='0' flexFlow='column'>
          <SecondaryNav
            title="Vault"
            tabs={[
              { title: 'Dashboard', id: 'Balance' },
              { title: 'Escrows', id: 'Escrows' },
              { title: 'Auctions', id: 'Auctions' },
            ]}
            content={
              [
                <Flex fullWidth flexFlow='column'>
                  <StyledSectionTitle>Vault Dashboard</StyledSectionTitle>
                  <HR color='MID_GREY' />
                  {isLoading ? (
                    <LoadingContainer />
                  ) : <GridMain>
                    <StyledBlackCard flexFlow='column' padding='24px' gap={16}>
                      <h3>Wallet Card</h3>
                      {console.log(tokens)}
                      {
                        Object.values(tokens).map((k) => (
                          <StyledBlackItemCard align='center' padding='12px' justify='space-between'>
                            <Flex gap={8}>
                              <TokenIcon symbol={k.icon} />
                              {k.symbol}
                            </Flex>
                            <Flex flexFlow='column' align='flex-end'>
                              <p><b>{k.balance} {k.symbol}</b></p>
                              <p style={{color: "#9A9A9A"}}>${k.balance / 4}</p>
                            </Flex>
                          </StyledBlackItemCard>
                          )
                        )
                      }
                      <p style={{fontSize: 10}}>Last Updated: HH:MM:SS, MM/DD/YYYY</p>
                      <Button btnType="secondary">Transfer Tokens</Button>
                      <WalletTokens>ManageTokens</WalletTokens>
                      <h3>Manage Escrow</h3>
                      <Button textButton disabled>No assets in escrow</Button>
                      <StyledBlackCard align='center' padding='12px' justify='space-between'>
                        <Flex align="center" gap={12}>
                          <Icons.Wallet width={24} fill="#ffffff" height="auto" />
                          <Flex flexFlow='column'>
                            <p style={{fontSize: 12, color: "#9A9A9A"}}>{walletType.charAt(0).toUpperCase() + walletType.slice(1)}</p>
                            <p>{principal.toText().slice(0,2)}...{principal.toText().slice(-4)}</p>
                          </Flex>
                        </Flex>
                        <Flex flexFlow='column' align='flex-end'>
                          <Button iconButton size="medium">
                            <Icons.PDFIcon width={12} height="auto" />
                          </Button>
                        </Flex>
                      </StyledBlackCard>
                    </StyledBlackCard>
                    <div>
                      <Flex align='flex-start' gap={24}>
                        <StyledCollectionImg src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`} alt='' />
                        <Flex flexFlow="column" gap={8}>
                          <h2>{`${collectionData?.name}${' '}${'Collection'}`}</h2>
                          <p><span style={{color: "#9A9A9A"}}>Created by</span><span style={{color: "#9A9A9A"}}>{collectionData?.creator_name}</span> </p>
                          <br/>
                          <Flex>
                            <Flex flexFlow="column">
                              <h2>{collectionData?.total_in_collection}</h2>
                              <p style={{color: "#9A9A9A"}}>Owned Items</p>
                            </Flex>
                          </Flex>
                          <br/>
                          <p>{collectionData?.description}</p>
                          <p style={{color: "#9A9A9A"}}><b>Read More</b></p>
                          <br/>
                          <br/>
                        </Flex>
                      </Flex>
                      <HR color='MID_GREY' />
                      <br/>
                      <Flex justify="space-between" fullWidth>
                        <Flex align="center" gap={12}>
                          <Button iconButton size="small">
                            <Icons.FilterIcon />
                          </Button>
                          <StyledFilterSelect placeholder="Status: All" />
                          <Button size="small" btnType="outlined">More Filters</Button>
                        </Flex>
                        <Flex align="center" gap={12}>
                          <Button btnType="outlined" iconButton size="small">
                            <Icons.SearchIcon height={13} width={13} />
                          </Button>
                          <StyledFilterSelect placeholder="All Items" />
                          <StyledFilterSelect placeholder="Listed: Recent" />
                        </Flex>
                      </Flex>
                      <br/>

                      {
                        NFTData?.length > 0 ? (
                          <GridMain2NFTS>
                            {
                              NFTData.map((nft) => {
                                return (
                                  <Link to={`/${nft.id.nftID}`}>
                                    <Card flexFlow="column" style={{overflow: 'hidden', margin: '12px'}}>
                                      <img
                                        style={{width: '100%'}}
                                        src={`https://${canisterId}.raw.ic0.app/-/${nft.id.nftID}/preview`}
                                        alt=''
                                      />
                                      <Container size="full" padding="16px">
                                        <Flex flexFlow="column" gap={32}>
                                          <div>
                                            <p style={{fontSize: '12px', color: '#9A9A9A'}}>{nft?.collectionid} Collection</p>
                                            <p><b>{nft?.name}</b></p>
                                          </div>
                                          <div>
                                            <p style={{fontSize: '12px', color: '#9A9A9A'}}>Status</p>
                                            <p>{nft.id.sale === NaN ? 'No auction started' : nft.id.sale}</p>
                                          </div>
                                        </Flex>
                                      </Container>
                                    </Card>
                                  </Link>
                                )
                              })
                            }
                          </GridMain2NFTS>
                        ) : (
                          <Typography variant='h5' style={{ textAlign: 'center' }}>
                            You do not have any NFT in your wallet
                          </Typography>
                        )
                      }
                    </div>
                  </GridMain>}
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
                  ) : activeEscrows?.in?.data?.length > 0
                  || activeEscrows?.out?.data?.length > 0 ? (
                    <>
                      {activeEscrows?.in?.data?.length > 0 && (
                        <div style={{ marginBottom: 5 }}>
                          Received escrows
                          <Table
                            columns={activeEscrows.in.columns}
                            rows={FilteredActiveEscrowsIn}
                          />
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
              ]
            }
            onConnect={() => logIn('plug')}
            principal={principal?.toText()}
          />
          {tokenId && (
            <FormControlLabel
              style={{ float: 'right' }}
              control={(
                <Checkbox
                  checked={showOnlyTokenEntries}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowOnlyTokenEntries(e.target.checked)}
                />
              )}
              label={(
                <>
                  Show only entries for <b>{tokenId}</b>
                </>
              )}
            />
          )}

          <ConfirmSalesActionModal
            open={openConfirmation}
            handleClose={handleClose}
            currentToken={selectdNFT}
            action={dialogAction}
            escrow={selectedEscrow}
          />
        </Banner>
      ) : (
        <GuestContainer />
      )}
    </>
  )
}

export default WalletPage
