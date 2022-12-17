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
import { copyToClipboard, timeConverter } from '@dapp/utils'
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
import { useSnackbar } from 'notistack'


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
            Welcome to the Origyn Vault
          </h3>
          <br/>
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

const SocialMediaButton = styled(Button)`
background: #242424;
`

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

const WebsiteSVG = () => {
  return(
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C8.63333 20 7.34167 19.7373 6.125 19.212C4.90833 18.6873 3.846 17.9707 2.938 17.062C2.02933 16.154 1.31267 15.0917 0.788 13.875C0.262667 12.6583 0 11.3667 0 10C0 8.61667 0.262667 7.321 0.788 6.113C1.31267 4.90433 2.02933 3.846 2.938 2.938C3.846 2.02933 4.90833 1.31233 6.125 0.787C7.34167 0.262333 8.63333 0 10 0C11.3833 0 12.679 0.262333 13.887 0.787C15.0957 1.31233 16.154 2.02933 17.062 2.938C17.9707 3.846 18.6873 4.90433 19.212 6.113C19.7373 7.321 20 8.61667 20 10C20 11.3667 19.7373 12.6583 19.212 13.875C18.6873 15.0917 17.9707 16.154 17.062 17.062C16.154 17.9707 15.0957 18.6873 13.887 19.212C12.679 19.7373 11.3833 20 10 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.83767 16.429 6.613 15.837C6.38767 15.2457 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.18733 15.5583 4.912 16.175C5.63733 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3623 16.7917 15.087 16.175C15.8123 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6127 15.2457 13.388 15.837C13.1627 16.429 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.56233 11.3373 5.537 11.012C5.51233 10.6873 5.5 10.35 5.5 10C5.5 9.65 5.51233 9.31267 5.537 8.988C5.56233 8.66267 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.104 8.66267 2.062 8.988C2.02067 9.31267 2 9.65 2 10C2 10.35 2.02067 10.6873 2.062 11.012C2.104 11.3373 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4377 11.3373 12.463 11.012C12.4877 10.6873 12.5 10.35 12.5 10C12.5 9.65 12.4877 9.31267 12.463 8.988C12.4377 8.66267 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.56267 8.66267 7.538 8.988C7.51267 9.31267 7.5 9.65 7.5 10C7.5 10.35 7.51267 10.6873 7.538 11.012C7.56267 11.3373 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.896 11.3373 17.938 11.012C17.9793 10.6873 18 10.35 18 10C18 9.65 17.9793 9.31267 17.938 8.988C17.896 8.66267 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4373 8.66267 14.462 8.988C14.4873 9.31267 14.5 9.65 14.5 10C14.5 10.35 14.4873 10.6873 14.462 11.012C14.4373 11.3373 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8123 4.44167 15.087 3.825C14.3623 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1627 3.57067 13.388 4.162C13.6127 4.754 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.38767 4.754 6.613 4.162C6.83767 3.57067 7.1 3 7.4 2.45C6.46667 2.75 5.63733 3.20833 4.912 3.825C4.18733 4.44167 3.58333 5.16667 3.1 6Z" fill="white"/>
      </svg>
  )
}
const DiscordSVG = () => {
  return(
<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.9308 1.66358C15.6561 1.07868 14.2892 0.647749 12.8599 0.400938C12.8339 0.396174 12.8079 0.408078 12.7945 0.431887C12.6187 0.744566 12.4239 1.15248 12.2876 1.4731C10.7503 1.24296 9.22099 1.24296 7.71527 1.4731C7.57887 1.14535 7.37707 0.744566 7.20048 0.431887C7.18707 0.408873 7.16107 0.396969 7.13504 0.400938C5.70659 0.64696 4.33963 1.07789 3.06411 1.66358C3.05307 1.66834 3.04361 1.67628 3.03732 1.68659C0.444493 5.56023 -0.265792 9.33865 0.0826501 13.0702C0.0842267 13.0885 0.0944749 13.1059 0.108665 13.117C1.81934 14.3733 3.47642 15.136 5.10273 15.6415C5.12876 15.6495 5.15634 15.6399 5.1729 15.6185C5.55761 15.0932 5.90054 14.5392 6.19456 13.9567C6.21192 13.9226 6.19535 13.8821 6.15989 13.8686C5.61594 13.6623 5.098 13.4107 4.59977 13.125C4.56037 13.102 4.55721 13.0456 4.59347 13.0186C4.69831 12.9401 4.80318 12.8583 4.9033 12.7758C4.92141 12.7607 4.94665 12.7575 4.96794 12.767C8.24107 14.2614 11.7846 14.2614 15.0191 12.767C15.0404 12.7567 15.0657 12.7599 15.0846 12.775C15.1847 12.8575 15.2895 12.9401 15.3952 13.0186C15.4314 13.0456 15.4291 13.102 15.3897 13.125C14.8914 13.4162 14.3735 13.6623 13.8288 13.8678C13.7933 13.8813 13.7775 13.9226 13.7949 13.9567C14.0952 14.5384 14.4381 15.0923 14.8157 15.6177C14.8315 15.6399 14.8599 15.6495 14.8859 15.6415C16.5201 15.136 18.1772 14.3733 19.8879 13.117C19.9028 13.1059 19.9123 13.0893 19.9139 13.071C20.3309 8.7569 19.2154 5.00947 16.9568 1.68738C16.9513 1.67628 16.9419 1.66834 16.9308 1.66358ZM6.68335 10.7981C5.69792 10.7981 4.88594 9.89338 4.88594 8.78231C4.88594 7.67124 5.68217 6.76654 6.68335 6.76654C7.69239 6.76654 8.49651 7.67919 8.48073 8.78231C8.48073 9.89338 7.68451 10.7981 6.68335 10.7981ZM13.329 10.7981C12.3435 10.7981 11.5316 9.89338 11.5316 8.78231C11.5316 7.67124 12.3278 6.76654 13.329 6.76654C14.338 6.76654 15.1421 7.67919 15.1264 8.78231C15.1264 9.89338 14.338 10.7981 13.329 10.7981Z" fill="white"/>
</svg>

  )
}
const TwitterSVG = () => {
  return(
<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.2918 16C13.8371 16 17.9652 9.84369 17.9652 4.50658C17.9652 4.33351 17.9613 4.15659 17.9535 3.98352C18.7566 3.41173 19.4496 2.70348 20 1.89206C19.2521 2.21968 18.458 2.43365 17.6449 2.52665C18.5011 2.02137 19.1421 1.22761 19.4492 0.292501C18.6438 0.762466 17.763 1.09399 16.8445 1.27285C16.2257 0.625448 15.4075 0.196792 14.5164 0.0531537C13.6253 -0.0904844 12.711 0.0588966 11.9148 0.478201C11.1186 0.897505 10.4848 1.56338 10.1115 2.37287C9.73825 3.18236 9.64619 4.09039 9.84961 4.95656C8.21874 4.87598 6.62328 4.45886 5.16665 3.73224C3.71002 3.00561 2.42474 1.98571 1.39414 0.738639C0.870333 1.62782 0.710047 2.68001 0.945859 3.68136C1.18167 4.68271 1.79589 5.5581 2.66367 6.12959C2.01219 6.10923 1.37498 5.93653 0.804688 5.62577V5.67576C0.804104 6.60889 1.13175 7.51342 1.73192 8.2356C2.3321 8.95777 3.16777 9.45302 4.09687 9.63716C3.49338 9.79973 2.85999 9.82342 2.2457 9.70638C2.50788 10.5089 3.01798 11.2108 3.70481 11.7141C4.39164 12.2174 5.22093 12.497 6.07695 12.514C4.62369 13.6379 2.82848 14.2476 0.980469 14.2447C0.652739 14.2442 0.325333 14.2244 0 14.1855C1.87738 15.3713 4.06128 16.0011 6.2918 16Z" fill="white"/>
</svg>

  )
}
const MediumSVG = () => {
  return(
<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.011 2.35847H20.8093V0H13.2509L10.7388 9.26312H10.6701L8.18129 0H0.599609V2.35847H1.37566C1.74288 2.41806 2.03627 2.69622 2.11534 3.05974V12.9928C2.03202 13.3445 1.73518 13.6048 1.37566 13.6415H0.599609V16H6.66251V13.6415H5.14679V3.2002H5.23571L8.72897 16H11.4694L15.0091 3.2002H15.0829V13.6415H13.5671V16H20.8093V13.6415H20.01C19.6596 13.5958 19.3742 13.3378 19.2935 12.9938V3.06075C19.3696 2.70363 19.6523 2.4269 20.011 2.35847Z" fill="white"/>
</svg>

  )
}
const DistriktSVG = () => {
  return(
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2183_6405)">
<path d="M24 0H0V24H24V0Z" fill="white" fill-opacity="0.01"/>
<path d="M21.65 2.3999H18.041V6.00893H21.65V2.3999Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.3896 6.49023H5.69043V10.0993H13.3896V17.7985H16.9987V10.0993V6.49023H13.3896Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.20863 21.6002H12.9078V17.9912H5.20863V10.292H1.59961V17.9912V21.6002H5.20863Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_2183_6405">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>


  )
}
const DscvrSVG = () => {
  return(
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.46791 12.1344C6.46791 12.1344 7.33327 12.9621 8.84839 13.2808C8.83135 13.2941 8.84839 6.6751 8.84839 6.6751C8.84839 6.6751 11.7217 5.92685 13.2452 8.18518C13.2658 8.19846 14.5813 10.1844 13.0534 12.3685C13.0476 12.3859 11.7969 14.148 9.36047 13.9445C9.33927 13.939 6.55567 14.139 4.77647 11.1621C4.76464 11.1517 2.94897 7.8335 5.02899 4.63653C5.01206 4.61887 6.63287 1.83045 10.4017 2.06863C10.4077 2.06429 15.3397 2.06373 17.4491 7.37958C17.4646 7.41046 18.9121 11.1324 16.5513 14.2102C16.5473 14.2368 14.4995 18.1569 9.20487 17.767C9.19911 17.7929 4.13438 17.972 1.86493 12.1344C1.86856 12.1345 0.772445 9.79998 1.86493 6.05182C1.8836 6.0131 1.79148 5.52941 1.51857 5.52941C1.50806 5.53636 0.833717 6.38558 0.516845 8.47302C0.501853 8.45206 -0.0834194 11.6879 1.51857 14.5219C1.51746 14.5285 3.47633 18.506 8.51975 19.5081C8.52495 19.4559 13.8471 20.6255 17.6163 15.8937C17.6118 15.8661 20.5137 12.8637 19.1995 7.14278C19.1573 7.12022 17.6008 1.08901 10.6289 0.424309C10.6242 0.433861 5.84901 -0.174826 3.34861 4.14909C3.33953 4.13614 1.16692 7.72198 3.17167 11.6869C3.16736 11.7014 5.47873 16.4919 10.6289 15.8937C10.6415 15.9051 15.6621 15.3633 16.1067 9.9999C16.0937 9.98278 15.8841 4.15297 10.2451 3.86253C10.1964 3.85355 8.50055 3.82614 6.32855 5.06093C6.30239 5.0789 6.46791 12.1344 6.46791 12.1344Z" fill="white"/>
</svg>

  )
}

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
  const [inputText, setInputText] = useState("");
  const [activeEscrows, setActiveEscrows] = useState<any>()
  const [outEscrows, setOutEscrows] = useState<any>()
  const [dialogAction, setDialogAction] = useState<any>()
  const [activeSales, setActiveSales] = useState<any>({
    columns: activeSalesColumns,
  })
  const [creator, setCreator] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showOnlyTokenEntries, setShowOnlyTokenEntries] = useState(true)
  const [openTrx, setOpenTrx] = useState(false)
  const { enqueueSnackbar } = useSnackbar() || {}

  const { open } = useDialog()

  const { activeTokens, time, refreshAllBalances } = useTokensContext()

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
            setCreator(r.ok.metadata[0].Class.find(({ name }) => name === 'com.origyn.originator').value.Principal.toText())
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
              const openSale = it.current_sale[0]?.sale_type?.auction?.status?.hasOwnProperty('open')
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
                id: { nftID: nftID, sale: filterSale, open: openSale },
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
  }, [loggedIn, actor, principal]);

  useEffect(() => {
    document.title = 'Origyn Vault';
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
      case 'all':
        filtered = filtered
        break
    }
    
    if (inputText==='') {
      filtered = filtered
    } else {
    filtered = filtered.filter((nft) => (nft?.display_name.toLowerCase().includes(inputText)))
    }

    setFilteredNFTData(filtered)
    refreshAllBalances(false, principal)
  }, [filter, sort, inputText])

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
                            <Button iconButton size='medium' onClick={() => copyToClipboard(principal.toText(), () => {
                              enqueueSnackbar('Copied to clipboard', {
                                variant: 'success',
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'right',
                                },
                              })
                            })}>
                              <Icons.CopyIcon width={12} height='auto' />
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
                        <Flex flexFlow='column' fullWidth justify="space-between" gap={8}>

                          <Flex flexFlow="row" align='center' fullWidth justify="space-between" smFlexFlow="column">
                          <h2>{collectionData?.display_name}</h2>
                          
                          <Flex style={{flexWrap: 'wrap', marginTop: '8px', alignContent: 'flex-end'}} gap={8}>{collectionData?.social_links?.thawed?.map((links, index) => (
                                <SocialMediaButton as='a' iconButton href={links?.Class?.find(({ name }) => name === 'url')?.value?.Text} key={index}>                           
                                {{
                                  'twitter' :  <TwitterSVG/>,
                                  'discord':  <DiscordSVG/>,
                                  'medium' :<MediumSVG/>,
                                  'dscvr' :  <DscvrSVG/>,
                                  'distrikt' :  <DistriktSVG/>,
                                  'website' :  <WebsiteSVG/>,
                                }[links?.Class?.find(({ name }) => name === 'type')?.value?.Text]}
                                </SocialMediaButton>
                               ))}
                               </Flex>   
                          </Flex>       
                               
                          <p>
                            <span className='secondary_color'>Created by </span>
                            <span className='secondary_color'>
                              {creator
                                ? (
                                  creator
                                ) : (
                                   ('no creator_name')
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
                        onInput={setInputText}
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
                                          {collectionData?.display_name}
                                        </p>
                                        <p>
                                          <b>{ nft['display_name'] || nft.id.nftID}</b>
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '12px', color: '#9A9A9A' }}>Status</p>
                                        <p>
                                          {nft.id.open ? nft.id.sale : 'No auction started'}
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
            onConnect={open}
            principal={principal?.toText() === "2vxsx-fae" ? "" : principal?.toText()}
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
