import { Principal } from "@dfinity/principal";
import { getAccountId, Transactions } from "@dapp/utils"

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

const SaleEnded = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted: string
) => {

    var sale_ended = "Sale Ended";

              var end_seller = obj_transaction[_props].seller;
              var end_buyer = obj_transaction[_props].buyer;
              var end_token = obj_transaction[_props].token;
              //specs seller
              var seller_principal = end_seller.principal;
              var seller_id = end_seller.account_id;
              var seller_ext = end_seller.extensible;
              if (!seller_id) {
                seller_id = "Id undefined";
              }
              var seller_ext = end_seller.extensible;
              if (!seller_ext) {
                seller_ext = "Extensible";
              }
              var seller_account = TypeAccount(
                seller_principal,
                seller_id,
                seller_ext
              );
              //specs buyer
              var buyer_principal = end_buyer.principal;
              var buyer_id = end_buyer.account_id;
              if (!buyer_id) {
                buyer_id = "Id undefined";
              }
              var buyer_ext = end_buyer.extensible;
              if (!buyer_ext) {
                buyer_ext = "Extensible";
              }
              var buyer_account = TypeAccount(
                buyer_principal,
                buyer_id,
                buyer_ext
              );
              //specs token
              var tokenProps: string;
              for (tokenProps in end_token) {
                var _canister = end_token[tokenProps].canister;
                var _fee = end_token[tokenProps].fee;
                var _symbol = end_token[tokenProps].symbol;
                var _decimals = end_token[tokenProps].decimals;
                var _standard = end_token[tokenProps].standard;

                for (const prop of Object.keys(_standard)) {
                  var token_standard = prop;
                }
              }
              //Object token
              var obj_token_end = TypeTokenSpec(
                _canister,
                _fee,
                _symbol,
                _decimals,
                token_standard
              );

              var end_sale_id = obj_transaction[_props].sale_id[0];
              if (!end_sale_id) {
                end_sale_id = "Sale ID not defined";
              } else {
                end_sale_id[0];
              }
              var end_amount = obj_transaction[_props].amount;

              //Down here the accounts or principals of the transaction.
              //Need them for filter transaction using principal or account
              var array_accounts: string[] = [];
              array_accounts.push(
                getAccountId(seller_principal._arr),
                getAccountId(buyer_principal._arr)
              );

              var array_principals: string[] = [];
              array_principals.push(obj_token_end.canister_string);
              console.log("Principal", obj_token_end.canister_string);

              transactionObj = {
                trans_index: curr_obj.index.toString(),
                token_id: curr_obj.token_id,
                type_txn: _transaction_type_formatted,
                message: sale_ended,
                accounts: removeDuplicates(array_accounts),
                principals: removeDuplicates(array_principals),
                seller: seller_account,
                buyer: buyer_account,
                token: obj_token_end,
                sale: end_sale_id,
                amount: end_amount,
              };

return (
    transactionObj
)
};

export default SaleEnded;