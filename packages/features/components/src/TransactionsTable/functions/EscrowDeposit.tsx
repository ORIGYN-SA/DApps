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
const EscrowDeposit = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted: string
) => {
  
     //get buyer and seller objs
     var dep_buyer = obj_transaction[_props].buyer;
     var dep_seller = obj_transaction[_props].seller;
     //enter in buyer
     var buyer_principal = dep_buyer.principal;
     var buyer_id = dep_buyer.account_id;
     var buyer_ext = dep_buyer.extensible;
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
     var seller_principal = dep_seller.principal;
     var seller_id = dep_seller.account_id;
     var seller_ext = dep_seller.extensible;
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
     var dep_token = obj_transaction[_props].token;

     var tokenProps: string;
     for (tokenProps in dep_token) {
       var _canister = dep_token[tokenProps].canister;
       var _fee = dep_token[tokenProps].fee;
       var _symbol = dep_token[tokenProps].symbol;
       var _decimals = dep_token[tokenProps].decimals;
       var _standard = dep_token[tokenProps].standard;

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
     var dep_trans = obj_transaction[_props].trx_id;
     var trans_nat = dep_trans.nat;
     var trans_text = dep_trans.text;
     var trans_ext = dep_trans.extensible;

     var dep_trx: TypeTransactionId = {
       _nat: trans_nat,
       _text: trans_text,
       _extensible: trans_ext,
     };

     //Down here the accounts or principals of the transaction.
     //Need them for filter transaction using principal or account
     var array_accounts: string[] = [];
     array_accounts.push(
       getAccountId(seller_principal._arr),
       getAccountId(buyer_principal._arr)
     );
     var array_principals: string[] = [];
     array_principals.push(obj_token.canister_string);

     transactionObj = {
       trans_index: curr_obj.index.toString(),
       token_id: curr_obj.token_id,
       type_txn: _transaction_type_formatted,
       message: "Escrow Deposit",
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
)
};

export default EscrowDeposit;