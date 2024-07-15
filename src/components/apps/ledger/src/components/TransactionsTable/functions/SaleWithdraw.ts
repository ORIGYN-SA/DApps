import { Transactions, TypeTransactionId, getAccountId } from '@dapp/utils';
import {
  getAccount,
  getToken,
  removeDuplicates,
  getPrincipalAccountFromArray,
} from './TableFunctions';

export const SaleWithdraw = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {
  // get buyer and seller objs
  const sale_wit_buyer = obj_transaction[_props].buyer;
  const sale_wit_seller = obj_transaction[_props].seller;

  // enter in buyer
  let buyer_id = sale_wit_buyer.account_id;
  let buyer_ext = sale_wit_buyer.extensible;
  if (!buyer_id) {
    buyer_id = 'Id undefined';
  }
  if (!buyer_ext) {
    buyer_ext = 'Extensible';
  }
  // account BUYER
  const buyer_account = getAccount(sale_wit_buyer.principal, buyer_id, buyer_ext);

  // enter in seller
  let seller_id = sale_wit_seller.account_id;
  let seller_ext = sale_wit_seller.extensible;
  if (!seller_id) {
    seller_id = 'Id undefined';
  }
  if (!seller_ext) {
    seller_ext = 'Extensible';
  }

  let sellerAccount; // seller account

  if ('principal' in sale_wit_seller) {
    sellerAccount = getAccount(sale_wit_seller.principal, seller_id, seller_ext);
  } else {
    sellerAccount = getAccount(sale_wit_seller.account.owner, seller_id, seller_ext);
  }

  // token obj
  const sale_wit_token = obj_transaction[_props].token;
  let token_standard: string | undefined;
  let obj_token: any;

  let tokenProps: string;
  for (tokenProps in sale_wit_token) {
    var _canister = sale_wit_token[tokenProps].canister;
    var _fee = sale_wit_token[tokenProps].fee;
    var _symbol = sale_wit_token[tokenProps].symbol;
    var _decimals = sale_wit_token[tokenProps].decimals;
    const _standard = sale_wit_token[tokenProps].standard;

    for (const prop of Object.keys(_standard)) {
      token_standard = prop;
    }
  }

  if (token_standard) {
    const obj_token = getToken(_canister, _fee, _symbol, _decimals, token_standard);
  }
  // trans type
  const sale_wit_trans = obj_transaction[_props].trx_id;
  const trans_nat = sale_wit_trans.nat;
  const trans_text = sale_wit_trans.text;
  const trans_ext = sale_wit_trans.extensible;
  // trx id
  const sale_wit_trx: TypeTransactionId = {
    _nat: trans_nat,
    _text: trans_text,
    _extensible: trans_ext,
  };

  // Down here the accounts or principals of the transaction.
  // Need them for filter transaction using principal or account
  let saleWithdrawBuyerAccountId = getPrincipalAccountFromArray(sale_wit_buyer.principal);
  let saleWithdrawSellerAccountId;
  if ('principal' in sale_wit_seller) {
    saleWithdrawSellerAccountId = getPrincipalAccountFromArray(sale_wit_seller.principal);
  } else {
    saleWithdrawSellerAccountId = getPrincipalAccountFromArray(sale_wit_seller.account.owner);
  }
  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(saleWithdrawBuyerAccountId),
    getAccountId(saleWithdrawSellerAccountId),
  );
  const array_principals: string[] = [];
  array_principals.push(obj_token.canister_string);
  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: 'Sale withdraw',
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    token: obj_token,
    buyer: buyer_account,
    seller: sellerAccount,
    amount: obj_transaction[_props].amount,
    fee: obj_transaction[_props].fee,
    trx_id: sale_wit_trx,
  };
  return transactionObj;
};
