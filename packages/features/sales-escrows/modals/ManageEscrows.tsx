import React, { useContext, useEffect, useState } from 'react';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { AuthContext, useAuthContext } from '@dapp/features-authentication';
import {
  Container,
  Flex,
  HR,
  Modal,
  TextInput,
  Select,
  Button,
  Card,
} from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';
import styled from 'styled-components';
import {
  TabPanel,
  TokenIcon,
  Table,
  NatPrice,
  LoadingContainer,
  WalletTokens,
} from '@dapp/features-components';
import { ConfirmSalesActionModal, StartAuctionModal } from '@dapp/features-sales-escrows';

const ManageEscrowsModal = ({ open, handleClose, activeEsc }: any) => {
  const { loggedIn, principal, actor, canisterId } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();

  const withdrawEscrow = async (escrow) => {
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
    setSelectdNFT(escrow.token_id);
  };

  console.log('this is true', activeEsc);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Manage Escrow</h2>
          <br />
          <Card align="center" padding="12px" justify="space-between">
            <Flex gap={8}>
              <TokenIcon symbol={tokens['OGY']?.icon} />
              {tokens['OGY']?.icon}
            </Flex>
            <Flex flexFlow="column" align="flex-end">
              <p>
                <b>
                  {tokens['OGY']?.balance} {tokens['OGY']?.symbol}
                </b>
              </p>
              <p style={{ color: '#9A9A9A' }}>${tokens['OGY']?.balance / 4}</p>
            </Flex>
          </Card>

          {activeEsc.map((esc: any, index) => (
            <Flex flexFlow="row">
              <img src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`} alt="" />
              <Flex flexFlow="column">
                <span>{esc.token_id}</span>
                <span>bm</span>
              </Flex>
              <Flex flexFlow="column">
                <span>Amount</span>
                <span>{parseFloat((parseInt(esc.amount) * 1e-8).toString()).toFixed(9)}</span>
              </Flex>
              <Flex flexFlow="column">
                <span>Status</span>
                <span>{Date.now() * 1e6 > parseInt(esc.ending) ? 'Active' : 'Expired'}</span>
              </Flex>
              {Date.now() * 1e6 > parseInt(esc.ending) ? (
                ''
              ) : (
                <Button bTnType="secondary" onClick={() => withdrawEscrow(esc[index])}>
                  Withdraw
                </Button>
              )}
            </Flex>
          ))}
        </Container>
      </Modal>

      <ConfirmSalesActionModal
        open={openConfirmation}
        handleClose={handleClose}
        currentToken={selectdNFT}
        action={dialogAction}
        escrow={selectedEscrow}
      />
    </div>
  );
};

export default ManageEscrowsModal;
