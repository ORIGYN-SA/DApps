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

const StyledNFTImg = styled.img`
  width: 100%;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 12px;
  height: calc(10vw - 20px);
  position: relative;
  
  &.errorImage::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyoAAAMqCAYAAABtybXHAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3f2TFNX1B+DLm6xIQJDgqhsRJbCWpsz//1ckFRNeIiFSiCiwvIiLC8J+6+43JMYAM3OnT/fp6WeqKH/YuadPP+f+kE965s6+O3fu7BYvAgQIECBAgAABAgQIJBLYJ6gkmoZWCBAgQIAAAQIECBDYExBUbAQCBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECAAAECBNIJCCrpRqIhAgQIECBAgAABAgQEFXuAAAECBAgQIECAAIF0AoJKupFoiAABAgQIECBAgAABQcUeIECAAAECBAgQIEAgnYCgkm4kGiJAgAABAgQIECBAQFCxBwgQIECAAAECBAgQSCcgqKQbiYYIECBAgAABAgQIEBBU7AECBAgQIECA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kSOCSbi2CxAgMEUBQWWKU3fPBAgQmIBAfepSA0v99+TJk71/P//8894RyPW/z58/f+lxyPXJyP79+/eEDh06VN54441y8ODBvf/WJyb1aUn9QrwXAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBOrEM+QAAAo9SURBVAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQKCCqxvqoTIECAAAECBAgQINAgIKg0oFlCgAABAgQIECBAgECsgKAS66s6AQIECBAgQIAAAQINAoJKA5olBAgQIECAAAECBAjECggqsb6qEyBAgAABAgQIECDQICCoNKBZQoAAAQIECBAgQIBArICgEuurOgECBAgQIECAAAECDQKCSgOaJQQIECBAgAABAgQIxAoIKrG+qhMgQIAAAQIECBAg0CAgqDSgWUKAAAECBAgQIECAQKyAoBLrqzoBAgQIECBAgAABAg0CgkoDmiUECBAgQIAAAQIECMQK/B9d9hNVBnYnzwAAAABJRU5ErkJggg==");
    background-size: cover;
    background-position: center;
  }
  ${({theme}) => theme.media.xl} {
    height: calc(15vw - 20px);
  }
  
  ${({theme}) => theme.media.lg} {
    height: calc(20vw - 20px);
  }

  ${({theme}) => theme.media.md} {
    height: calc(50vw - 20px);
  }

  ${({theme}) => theme.media.sm} {
    height: calc(100vw - 20px);
  }

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
                        <Flex flexFlow='column' justify="space-between" gap={8}>
                          <h2><b>{collectionData?.display_name}</b></h2>
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
                                  <StyledNFTImg
                                    onError={(e) => {
                                      e.target.onerror = null; // prevents looping
                                      e.currentTarget.className += " errorImage";
                                    }}
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
