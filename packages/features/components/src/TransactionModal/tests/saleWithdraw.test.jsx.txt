import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import { seller_account, buyer_account, Token, sale_wit_trx } from './data';

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Sale withdraw',
    message: 'Sale withdraw',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    seller: seller_account,
    buyer: buyer_account,
    token: Token,
    sale: 'SaleId',
    amount: 'End amount',
    fee: 'Fee',
    trx_id: sale_wit_trx,
  },
};

describe('Component/TransactionModal/Sale withdraw', () => {
  it('should display transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect(screen.getByText(props.modalData.type_txn)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.trx_id._text)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.buyer.acc_principal_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.seller.acc_principal_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token_id)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.amount)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.fee)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.canister_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.fee)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.decimal)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.token.standard)).toBeInTheDocument();
  });
  //the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  });
});
