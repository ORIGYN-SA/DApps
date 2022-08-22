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
    screen.getByText(props.modalData.type_txn);
    screen.getByText(props.modalData.buyer.acc_principal_string);
    screen.getByText(props.modalData.amount);
    screen.getByText(props.modalData.token.canister_string);
    screen.getByText(props.modalData.token.fee);
    screen.getByText(props.modalData.token.decimal);
    screen.getByText(props.modalData.token.standard);
    screen.getByText(props.modalData.amount);
    screen.getByText(props.modalData.sale_id);
  });
  // the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});
