import { Principal } from "@dfinity/principal";
import { getAccountId, Transactions, Sale } from "@dapp/utils";

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
//format a principal and return a string
function formatPrincipal(_Uint8Array: { principal: { _arr: [] } }) {
    let thisArray = Uint8Array.from(Object.values(_Uint8Array.principal._arr));
    var acc_principal_string = Principal.fromUint8Array(thisArray).toText();
    return acc_principal_string;
}

//array without duplicates
function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

const Mint = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted:string
) => {

    var mint: string = "Mint";

    var array8uint_from = obj_transaction[_props].from;
    var mint_from = formatPrincipal(array8uint_from);

    var array8uint_to = obj_transaction[_props].to;
    var mint_to = formatPrincipal(array8uint_to);

    var mint_sale = obj_transaction[_props].sale;

    var token_obj = mint_sale.token;

    let sale_obj: Sale;

    if (!token_obj) {
        sale_obj = {
            token: "Token not defined",
            amount: "Amount not defined",
        };
    } else {
        var tokenProps: string;
        for (tokenProps in token_obj) {
            var _canister = token_obj[tokenProps].canister;
            var _fee = token_obj[tokenProps].fee;
            var _symbol = token_obj[tokenProps].symbol;
            var _decimals = token_obj[tokenProps].decimals;
            var _standard = token_obj[tokenProps].standard;

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
        sale_obj = {
            token: obj_token,
            amount: mint_sale.amount,
        };
    }
    //Down here the accounts or principals of the transaction.
    //Need them for filter transaction using principal or account
    var array_accounts: string[] = [];
    array_accounts.push(
        getAccountId(array8uint_from.principal._arr),
        getAccountId(array8uint_to.principal._arr)
    );
    var array_principals: string[] = [];
    array_principals.push();
    transactionObj = {
        trans_index: curr_obj.index.toString(),
        token_id: curr_obj.token_id,
        type_txn: _transaction_type_formatted,
        message: mint,
        accounts: removeDuplicates(array_accounts),
        principals: removeDuplicates(array_principals),
        mint_from: mint_from,
        mint_to: mint_to,
        sale: sale_obj,
    };

    return (
        transactionObj
    )
};

export default Mint;