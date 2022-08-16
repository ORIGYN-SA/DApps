import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { TypeTokenSpec } from '@dapp/utils';
import { Transaction } from '..';
import testData from './data'

const tokenProps = {
  ic :  {
    "fee": "10000",
    "decimals": "8",
    "canister": {
        "_arr": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 2,
            "8": 1,
            "9": 1
        },
        "_isPrincipal": true
    },
    "standard": {
        "Ledger": null
    },
    "symbol": "ICP"
}
}

const bid_obj_token = TypeTokenSpec( 
  tokenProps.ic.canister,
  tokenProps.ic.fee,
  tokenProps.ic.symbol,
  tokenProps.ic.decimals,
  tokenProps.ic.standard
  )

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Auction bid',
    message: 'Auction bid',
    accounts: 'AccountsHere',
    buyer : testData.buyer_account,
    amount : 'bidAMount',
    token:bid_obj_token,
    sale_id:'SaleID'
  },
};

describe('Component/TransactionModal/AuctionBid', () => {
  it('should display OWNER TRANSFER transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect(console.log(sale_obj))
  });
});
