import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import testData from './data'

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Owner transfer',
    message: 'Owner Transfer',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    to: testData.trans_to_account,
    from: testData.trans_from_account
  },
};

describe('Component/TransactionModal/OwnerTransfer', () => {
  it('should display OWNER TRANSFER transaction values', () => {
    const { getByText } = render(Transaction(props));
    screen.getByText(props.modalData.type_txn)
    screen.getByText(props.modalData.to.acc_principal_string)
    screen.getByText(props.modalData.from.acc_principal_string)
  });
});
