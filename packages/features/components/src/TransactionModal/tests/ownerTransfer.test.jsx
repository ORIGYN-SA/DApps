import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import { trans_from_account, trans_to_account } from './data';

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Owner transfer',
    message: 'Owner Transfer',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    to: trans_to_account,
    from: trans_from_account,
  },
};

describe('Component/TransactionModal/OwnerTransfer', () => {
  it('should display OWNER TRANSFER transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect(screen.getByText(props.modalData.type_txn)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.to.acc_principal_string)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.from.acc_principal_string)).toBeInTheDocument();
  });
  //the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  });
});
