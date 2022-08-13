import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import '@testing-library/jest-dom';

import { AuctionBid } from '../functions/AuctionBid';
import { EscrowDeposit } from '../functions/EscrowDeposit';
import { EscrowWithdraw } from '../functions/EscrowWithdraw';
import { Mint } from '../functions/Mint';
import { OwnerTransfer } from '../functions/OwnerTransfer';
import { SaleEnded } from '../functions/SaleEnded';
import { SaleOpened } from '../functions/SaleOpened';
import { SaleWithdraw } from '../functions/SaleWithdraw';

