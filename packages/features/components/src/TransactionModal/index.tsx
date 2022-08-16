import React from 'react';
import { Box } from '@mui/material';
import Mint from './TransactionTypes/Mint';
import SaleOpened from './TransactionTypes/SaleOpened';
import SaleEnded from './TransactionTypes/SaleEnded';
import {AuctionBid} from './TransactionTypes/AuctionBid';
import OwnerTransfer from './TransactionTypes/OwnerTransfer';
import EscrowDeposit from './TransactionTypes/EscrowDeposit';
import EscrowWithdraw from './TransactionTypes/EscrowWithdraw';
import SaleWithdraw from './TransactionTypes/SaleWithdraw';

export const Transaction = (props : any) => (
  <Box>
    {(() => {
      switch (props.modalData.type_txn) {
        case 'Auction bid':
          return <AuctionBid data={props.modalData} />;
        case 'Mint':
          return <Mint data={props.modalData} />;
        case 'Sale opened':
          return <SaleOpened data={props.modalData} />;
        case 'Sale ended':
          return <SaleEnded data={props.modalData} />;
        case 'Owner transfer':
          return <OwnerTransfer data={props.modalData} />;
        case 'Escrow deposit':
          return <EscrowDeposit data={props.modalData} />;
        case 'Escrow withdraw':
          return <EscrowWithdraw data={props.modalData} />;
        case 'Sale withdraw':
          return <SaleWithdraw data={props.modalData} />;
        default:
          return null;
      }
    })()}
  </Box>
);
