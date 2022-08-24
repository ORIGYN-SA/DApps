import { getAccountId, Transactions, Sale, TypeTokenSpec, removeDuplicates, objPrincipal } from '@dapp/utils';

export const Mint = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted:string,
) => {
  const mint: string = 'Mint';
  const from = obj_transaction[_props].from;
  const mint_from  = objPrincipal(from).toText();
  const to = obj_transaction[_props].to;
  const mint_to = objPrincipal(to).toText();

  const mint_sale = obj_transaction[_props].sale;

  const token_obj = mint_sale.token;

  let sale_obj: Sale;

  if (!token_obj) {
    sale_obj = {
      token: 'Token not defined',
      amount: 'Amount not defined',
    };
  } else {
    let tokenProps: string;
    for (tokenProps in token_obj) {
      var _canister = token_obj[tokenProps].canister;
      var _fee = token_obj[tokenProps].fee;
      var _symbol = token_obj[tokenProps].symbol;
      var _decimals = token_obj[tokenProps].decimals;
      const _standard = token_obj[tokenProps].standard;

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
    sale_obj = {
      token: obj_token,
      amount: mint_sale.amount,
    };
  }
  // Down here the accounts or principals of the transaction.
  // Need them for filter transaction using principal or account
  const array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(objPrincipal(from)),
    getAccountId(objPrincipal(to))
  );
  const array_principals: string[] = [];
  array_principals.push();
  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: mint,
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    mint_from,
    mint_to,
    sale: sale_obj,
  };

  return (
    transactionObj
  );
};
