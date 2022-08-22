import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import {buyer_account,seller_account,Token,dep_trx} from './data'

let props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Escrow deposit',
    message: 'Escrow deposit',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    buyer : buyer_account,
    seller: seller_account,
    amount : 'AMount',
    token: Token,
    sale_id:'SaleID',
    token: Token,
    amount: 'AMount',
    fee: 'Fee',
    trx_id: dep_trx
  }

};

describe('Component/TransactionModal/EscrowDeposit', () => {
  it('should display transaction values', () => {
    const { getByText } = render(Transaction(props));
    screen.getByText(props.modalData.type_txn);
    screen.getByText(props.modalData.buyer.acc_principal_string);
    screen.getByText(props.modalData.amount);
    screen.getByText(props.modalData.token.canister_string);
    screen.getByText(props.modalData.token.fee);
    screen.getByText(props.modalData.token.decimal);
    screen.getByText(props.modalData.token.standard);
    screen.getByText(props.modalData.amount);
    screen.getByText(props.modalData.trx_id._text);
    screen.getByText(props.modalData.token_id);
  });
  // the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});
