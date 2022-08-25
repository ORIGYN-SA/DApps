import { getAccountId, Transactions} from '@dapp/utils';
import { TypeAccount, TypeTokenSpec,removeDuplicates, objPrincipal } from './TableFunctions';

export const AuctionBid = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {
  const auction = 'Auction bid';
  const bid_buyer = obj_transaction[_props].buyer;
  const bid_account_id = bid_buyer.account_id;
  const bid_extensible = bid_buyer.extensible;
  // create account
  const buyer = TypeAccount(
    bid_buyer.principal,
    bid_account_id,
    bid_extensible,
  );

  const bid_amount = obj_transaction[_props].amount;
  const bid_token = obj_transaction[_props].token;
  console.log('TOKEN',bid_token);
  // token specs
  let tokenProps: string;
  for (tokenProps in bid_token) {
    var _canister = bid_token[tokenProps].canister;
    console.log(_canister);
    var _fee = bid_token[tokenProps].fee;
    var _symbol = bid_token[tokenProps].symbol;
    var _decimals = bid_token[tokenProps].decimals;
    var _standard = bid_token[tokenProps].standard;
  }

  for (const prop of Object.keys(_standard)) {
    var token_standard = prop;
  }
  const bid_obj_token = TypeTokenSpec(
    _canister,
    _fee,
    _symbol,
    _decimals,
    token_standard,
  );
  const bid_sale_id = obj_transaction[_props].sale_id;

  // Down here the accounts and the principals of the transaction.
  // Need them for filter transaction using principal or account
  const array_accounts: string[] = [];

  array_accounts.push(getAccountId(objPrincipal(bid_buyer)));
  const array_principals: string[] = [];
  array_principals.push(bid_obj_token.canister_string);

  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: auction,
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    buyer,
    amount: bid_amount,
    token: bid_obj_token,
    sale_id: bid_sale_id,
  };

  return (
    transactionObj
  );
};

