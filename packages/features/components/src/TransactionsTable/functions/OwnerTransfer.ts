import { getAccountId, Transactions } from '@dapp/utils';
import { TypeAccount, removeDuplicates } from './TableFunctions';

export const OwnerTransfer = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted:string,
) => {
  const trans_from = obj_transaction[_props].from;
  const trans_to = obj_transaction[_props].to;

  const from_principal = trans_from.principal;
  let from_id = trans_from.account_id;
  let from_ext = trans_from.extensible;
  if (!from_id) {
    from_id = 'Id undefined';
  }
  if (!from_ext) {
    from_ext = 'Extensible';
  }
  // account from
  const trans_from_account = TypeAccount(
    from_principal,
    from_id,
    from_ext,
  );

  const to_principal = trans_to.principal;
  let to_id = trans_to.account_id;
  let to_ext = trans_to.extensible;
  if (!to_id) {
    to_id = 'Id undefined';
  }
  if (!to_ext) {
    to_ext = 'Extensible';
  }
  // account to
  const trans_to_account = TypeAccount(to_principal, to_id, to_ext);

  // Down here the accounts or principals of the transaction.
  // Need them for filter transaction using principal or account
  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(from_principal._arr),
    getAccountId(to_principal._arr),
  );
  const array_principals: string[] = [];

  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: 'Owner Transfer',
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    to: trans_to_account,
    from: trans_from_account,
  };

  return (
    transactionObj
  );
};
