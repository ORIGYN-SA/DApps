import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import {buyer_account,Token} from './data'

let props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Auction bid',
    message: 'Auction bid',
    accounts: 'AccountsHere',
    buyer : buyer_account,
    amount : 'bidAMount',
    token: Token,
    sale_id:'SaleID'
  }
};

describe('Component/TransactionModal/AuctionBid', () => {
  it('should display OWNER TRANSFER transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect(screen.getByText(props.modalData.type_txn)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.buyer.acc_principal_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.amount)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.canister_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.fee)).toBeInTheDocument();;
    expect(screen.getByText(props.modalData.token.decimal)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.standard)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.amount)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.sale_id)).toBeInTheDocument();
  });
  // the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});

