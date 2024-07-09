import type { getAccountId, Transactions } from '@dapp/utils';
import { getToken, removeDuplicates, getPrincipalAccountFromArray, getAccount } from './TableFunctions';

export const RoyaltyPaid = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {

  const royaltyPaid: string = 'Royalty Paid';

  const buyer = obj_transaction[_props].buyer;
  const seller = obj_transaction[_props].seller;
  const receiver = obj_transaction[_props].receiver;

  // enter in buyer
  let buyerId = buyer.account_id;
  let buyerExt = buyer.extensible;
  if (!buyerId) {
    buyerId = 'Id undefined';
  }
  if (!buyerExt) {
    buyerExt = 'Extensible';
  }
  // account BUYER
  const buyerAccount = getAccount(
    buyer.principal,
    buyerId,
    buyerExt,
  );

  // enter in seller
  let sellerId = seller.account_id;
  let sellerExt = seller.extensible;
  if (!sellerId) {
    sellerId = 'Id undefined';
  }
  if (!sellerExt) {
    sellerExt = 'Extensible';
  }

  let sellerAccount;

  if ('principal' in seller) {
    sellerAccount = getAccount(
      seller.principal,
      sellerId,
      sellerExt,
    );
  } else {
    sellerAccount = getAccount(
      seller.account.owner,
      sellerId,
      sellerExt,
    );
  }

  // enter in receiver
  let receiverId = receiver.account_id;
  let receiverExt = receiver.extensible;
  if (!receiverId) {
    receiverId = 'Id undefined';
  }
  if (!receiverExt) {
    receiverExt = 'Extensible';
  }

  let receiverAccount;

  if ('principal' in receiver) {
    receiverAccount = getAccount(
      receiver.principal,
      receiverId,
      receiverExt,
    );
  } else {
    receiverAccount = getAccount(
      receiver.account.owner,
      receiverId,
      receiverExt,
    );
  }

  // token obj
  const token = obj_transaction[_props].token;

  let tokenProps: string;
  for (tokenProps in token) {
    var _canister = token[tokenProps].canister;
    var _fee = token[tokenProps].fee;
    var _symbol = token[tokenProps].symbol;
    var _decimals = token[tokenProps].decimals;
    const _standard = token[tokenProps].standard;

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

  let sellerAccountId;
  if ('principal' in seller) {
    sellerAccountId = getPrincipalAccountFromArray(seller.principal);
  } else {
    sellerAccountId = getPrincipalAccountFromArray(seller.account.owner);
  }
  let buyerAccountId;
  if ('principal' in buyer) {
    buyerAccountId = getPrincipalAccountFromArray(buyer.principal);
  } else {
    buyerAccountId = getPrincipalAccountFromArray(buyer.account.owner);
  }
  let receiverAccountId;
  if ('principal' in receiver) {
    receiverAccountId = getPrincipalAccountFromArray(receiver.principal);
  } else {
    receiverAccountId = getPrincipalAccountFromArray(receiver.account.owner);
  }

  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(buyerAccountId),
    getAccountId(sellerAccountId),
    getAccountId(receiverAccountId),
  );
  const array_principals: string[] = [];
  array_principals.push(obj_token.canister_string);
  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: royaltyPaid,
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    token: obj_token,
    receiver: receiverAccount,
    seller: sellerAccount,
    buyer: buyerAccount,
    amount: obj_transaction[_props].amount,
  };

  return (
    transactionObj
  );
};
