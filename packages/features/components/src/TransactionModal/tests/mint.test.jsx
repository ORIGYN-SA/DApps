import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import {sale_obj} from './data'

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Mint',
    message: 'Mint',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    mint_from: 'Mint from',
    mint_to: 'Mint to',
    sale: sale_obj
  },
};

describe('Component/TransactionModal/Mint', () => {
  it('should display MINT transaction values', () => {
    const { getByText } = render(Transaction(props));
    screen.getByText(props.modalData.mint_to);
    screen.getByText(props.modalData.mint_from);
    screen.getByText(props.modalData.type_txn);
    screen.getByText(props.modalData.sale.amount);
    screen.getByText(props.modalData.sale.token);
  });
  // the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});
