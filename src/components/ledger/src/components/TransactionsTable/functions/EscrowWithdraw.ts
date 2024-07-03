import { getAccountId, Transactions, TypeTransactionId } from '@dapp/utils';
import { getAccount, getToken, removeDuplicates, getPrincipalAccountFromArray } from './TableFunctions';

export const EscrowWithdraw = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {
  // get buyer and seller objs
  const wit_buyer = obj_transaction[_props].buyer;
  const wit_seller = obj_transaction[_props].seller;
  // enter in buyer

  let buyer_id = wit_buyer.account_id;
  let buyer_ext = wit_buyer.extensible;
  if (!buyer_id) {
    buyer_id = 'Id undefined';
  }
  if (!buyer_ext) {
    buyer_ext = 'Extensible';
  }
  // account BUYER
  const buyer_account = getAccount(
    wit_buyer.principal,
    buyer_id,
    buyer_ext,
  );

  // enter in seller

  let seller_id = wit_seller.account_id;
  let seller_ext = wit_seller.extensible;
  if (!seller_id) {
    seller_id = 'Id undefined';
  }
  if (!seller_ext) {
    seller_ext = 'Extensible';
  }
  // account SELLER
  const seller_account = getAccount(
    wit_seller.principal,
    seller_id,
    seller_ext,
  );

  // token obj
  const wit_token = obj_transaction[_props].token;

  let tokenProps: string;
  for (tokenProps in wit_token) {
    var _canister = wit_token[tokenProps].canister;
    var _fee = wit_token[tokenProps].fee;
    var _symbol = wit_token[tokenProps].symbol;
    var _decimals = wit_token[tokenProps].decimals;
    const _standard = wit_token[tokenProps].standard;

    for (const prop of Object.keys(_standard)) {
      var token_standard = prop;
    }
  }

  const obj_token = getToken(
    _canister,
    _fee,
    _symbol,
    _decimals,
    token_standard,
  );

  // trans type
  const wit_trans = obj_transaction[_props].trx_id;
  const trans_nat = wit_trans.nat;
  const trans_text = wit_trans.text;
  const trans_ext = wit_trans.extensible;

  const wit_trx: TypeTransactionId = {
    _nat: trans_nat,
    _text: trans_text,
    _extensible: trans_ext,
  };

  // SET SELLER,BUYER,TOKEN,TOKEN_ID,AMOUNT,FEE,TRX ID

  // Down here the accounts or principals of the transaction.
  // Need them for filter transaction using principal or account
  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(getPrincipalAccountFromArray(wit_buyer.principal)),
    getAccountId(getPrincipalAccountFromArray(wit_seller.principal))
  );
  const array_principals: string[] = [];
  array_principals.push(obj_token.canister_string);

  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: 'Escrow Withdraw',
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    token: obj_token,
    buyer: buyer_account,
    seller: seller_account,
    amount: obj_transaction[_props].amount,
    fee: obj_transaction[_props].fee,
    trx_id: wit_trx,
  };
  return (
    transactionObj
  );
};
