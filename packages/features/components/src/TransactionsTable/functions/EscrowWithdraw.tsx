import { Principal } from "@dfinity/principal";
import { formatTime, getAccountId, Transactions, TypeTransactionId } from "@dapp/utils"

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
const EscrowWithdraw = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted: string
) => {
  //get buyer and seller objs
  var wit_buyer = obj_transaction[_props].buyer;
  var wit_seller = obj_transaction[_props].seller;
  //enter in buyer
  var buyer_principal = wit_buyer.principal;
  var buyer_id = wit_buyer.account_id;
  var buyer_ext = wit_buyer.extensible;
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
  var seller_principal = wit_seller.principal;
  var seller_id = wit_seller.account_id;
  var seller_ext = wit_seller.extensible;
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
  var wit_token = obj_transaction[_props].token;

  var tokenProps: string;
  for (tokenProps in wit_token) {
    var _canister = wit_token[tokenProps].canister;
    var _fee = wit_token[tokenProps].fee;
    var _symbol = wit_token[tokenProps].symbol;
    var _decimals = wit_token[tokenProps].decimals;
    var _standard = wit_token[tokenProps].standard;

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
  var wit_trans = obj_transaction[_props].trx_id;
  var trans_nat = wit_trans.nat;
  var trans_text = wit_trans.text;
  var trans_ext = wit_trans.extensible;

  var wit_trx: TypeTransactionId = {
    _nat: trans_nat,
    _text: trans_text,
    _extensible: trans_ext,
  };

  // SET SELLER,BUYER,TOKEN,TOKEN_ID,AMOUNT,FEE,TRX ID

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
    message: "Escrow Withdraw",
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
)
};

export default EscrowWithdraw;