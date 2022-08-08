import { Principal } from "@dfinity/principal";
//Import Interfaces TS
import {
    Transactions,
    TypeTransactionId,
    getAccountId
} from "@dapp/utils"
//Create obj account
function TypeAccount(
    acc_principal: { _arr },
    acc_id: string,
    acc_extensible: string
) {
    let thisArray = Uint8Array.from(Object.values(acc_principal._arr));
    var acc_principal_string = Principal.fromUint8Array(thisArray).toText();
    return { acc_principal_string, acc_id, acc_extensible };
}
//Create obj Token
function TypeTokenSpec(
    canister: { _arr: [] },
    fee: string,
    symbol: string,
    decimal: string,
    standard: string
) {
    let thisArray = Uint8Array.from(Object.values(canister._arr));
    var canister_string = Principal.fromUint8Array(thisArray).toText();
    return { canister_string, fee, symbol, decimal, standard };
}

//array without duplicates
function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

const SaleWithdraw = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted: string
) => {
  //get buyer and seller objs
  var sale_wit_buyer = obj_transaction[_props].buyer;
  var sale_wit_seller = obj_transaction[_props].seller;
  //enter in buyer
  var buyer_principal = sale_wit_buyer.principal;
  var buyer_id = sale_wit_buyer.account_id;
  var buyer_ext = sale_wit_buyer.extensible;
  if (!buyer_id) {
    buyer_id = "Id undefined";
  }
  if (!buyer_ext) {
    buyer_ext = "Extensible";
  }
  //account BUYER
  var buyer_account = TypeAccount(
    buyer_principal,
    buyer_id,
    buyer_ext
  );

  //enter in seller
  var seller_principal = sale_wit_seller.principal;
  var seller_id = sale_wit_seller.account_id;
  var seller_ext = sale_wit_seller.extensible;
  if (!seller_id) {
    seller_id = "Id undefined";
  }
  if (!seller_ext) {
    seller_ext = "Extensible";
  }
  //account SELLER
  var seller_account = TypeAccount(
    seller_principal,
    seller_id,
    seller_ext
  );

  //token obj
  var sale_wit_token = obj_transaction[_props].token;

  var tokenProps: string;
  for (tokenProps in sale_wit_token) {
    var _canister = sale_wit_token[tokenProps].canister;
    var _fee = sale_wit_token[tokenProps].fee;
    var _symbol = sale_wit_token[tokenProps].symbol;
    var _decimals = sale_wit_token[tokenProps].decimals;
    var _standard = sale_wit_token[tokenProps].standard;

    for (const prop of Object.keys(_standard)) {
      var token_standard = prop;
    }
  }

  var obj_token = TypeTokenSpec(
    _canister,
    _fee,
    _symbol,
    _decimals,
    token_standard
  );

  //trans type
  var sale_wit_trans = obj_transaction[_props].trx_id;
  var trans_nat = sale_wit_trans.nat;
  var trans_text = sale_wit_trans.text;
  var trans_ext = sale_wit_trans.extensible;
  //trx id
  var sale_wit_trx: TypeTransactionId = {
    _nat: trans_nat,
    _text: trans_text,
    _extensible: trans_ext,
  };

  //Down here the accounts or principals of the transaction.
  //Need them for filter transaction using principal or account
  var array_accounts: string[] = [];
  array_accounts.push(
    getAccountId(buyer_principal._arr),
    getAccountId(seller_principal._arr)
  );
  var array_principals: string[] = [];
  array_principals.push(obj_token.canister_string);
  transactionObj = {
    trans_index: curr_obj.index.toString(),
    token_id: curr_obj.token_id,
    type_txn: _transaction_type_formatted,
    message: "Sale withdraw",
    accounts: removeDuplicates(array_accounts),
    principals: removeDuplicates(array_principals),
    token: obj_token,
    buyer: buyer_account,
    seller: seller_account,
    amount: obj_transaction[_props].amount,
    fee: obj_transaction[_props].fee,
    trx_id: sale_wit_trx,
  };
return (
    transactionObj
)
};

export default SaleWithdraw;