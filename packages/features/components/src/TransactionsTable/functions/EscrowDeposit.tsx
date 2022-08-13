import { getAccountId, Transactions, TypeTransactionId, TypeAccount, TypeTokenSpec, removeDuplicates } from '@dapp/utils';

export const EscrowDeposit = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {
  // get buyer and seller objs
  const dep_buyer = obj_transaction[_props].buyer;
  const dep_seller = obj_transaction[_props].seller;
  // enter in buyer
  const buyer_principal = dep_buyer.principal;
  let buyer_id = dep_buyer.account_id;
  let buyer_ext = dep_buyer.extensible;
  if (!buyer_id) {
    buyer_id = 'Id undefined';
  }
  if (!buyer_ext) {
    buyer_ext = 'Extensible';
  }
  // account BUYER
  const buyer_account = TypeAccount(
    buyer_principal,
    buyer_id,
    buyer_ext,
  );

  // enter in seller
  const seller_principal = dep_seller.principal;
  let seller_id = dep_seller.account_id;
  let seller_ext = dep_seller.extensible;
  if (!seller_id) {
    seller_id = 'Id undefined';
  }
  if (!seller_ext) {
    seller_ext = 'Extensible';
  }
  // account SELLER
  const seller_account = TypeAccount(
    seller_principal,
    seller_id,
    seller_ext,
  );

  // token obj
  const dep_token = obj_transaction[_props].token;

  let tokenProps: string;
  for (tokenProps in dep_token) {
    var _canister = dep_token[tokenProps].canister;
    var _fee = dep_token[tokenProps].fee;
    var _symbol = dep_token[tokenProps].symbol;
    var _decimals = dep_token[tokenProps].decimals;
    const _standard = dep_token[tokenProps].standard;

    for (const prop of Object.keys(_standard)) {
      var token_standard = prop;
    }
  }

  const obj_token = TypeTokenSpec(
    _canister,
    _fee,
    _symbol,
    _decimals,
    token_standard,
  );

  // trans type
  const dep_trans = obj_transaction[_props].trx_id;
  const trans_nat = dep_trans.nat;
  const trans_text = dep_trans.text;
  const trans_ext = dep_trans.extensible;

  const dep_trx: TypeTransactionId = {
    _nat: trans_nat,
    _text: trans_text,
    _extensible: trans_ext,
  };

  // Down here the accounts or principals of the transaction.
  // Need them for filter transaction using principal or account
  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(seller_principal._arr),
    getAccountId(buyer_principal._arr),
  );
  const array_principals: string[] = [];
  array_principals.push(obj_token.canister_string);

  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: 'Escrow Deposit',
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    token: obj_token,
    buyer: buyer_account,
    seller: seller_account,
    amount: obj_transaction[_props].amount,
    fee: obj_transaction[_props].fee,
    trx_id: dep_trx,
  };
  return (
    transactionObj
  );
};

