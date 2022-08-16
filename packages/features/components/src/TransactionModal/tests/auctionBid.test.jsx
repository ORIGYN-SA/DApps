import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { TypeTokenSpec } from '@dapp/utils';
import { Transaction } from '..';
import testData from './data'

let props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Auction bid',
    message: 'Auction bid',
    accounts: 'AccountsHere',
    buyer : testData.buyer_account,
    amount : 'bidAMount',
    token: {
      canister_string: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
      fee: '10000',
      symbol: 'ICP',
      decimal: '8',
      standard: null,
    },
    sale_id:'SaleID'
  }
};

describe('Component/TransactionModal/AuctionBid', () => {
  it('should display OWNER TRANSFER transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect(console.log(props))
  });
});
