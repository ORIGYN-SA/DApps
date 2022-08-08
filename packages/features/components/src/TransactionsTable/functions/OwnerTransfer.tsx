import { Principal } from "@dfinity/principal";
import { getAccountId, Transactions, formatTime } from "@dapp/utils"

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

//array without duplicates
function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

const OwnerTransfer = (
    obj_transaction,
    _props: string,
    transactionObj: Transactions,
    curr_obj,
    _transaction_type_formatted:string
) => {
    var trans_from = obj_transaction[_props].from;
    var trans_to = obj_transaction[_props].to;

    var from_principal = trans_from.principal;
    var from_id = trans_from.account_id;
    var from_ext = trans_from.extensible;
    if (!from_id) {
      from_id = "Id undefined";
    }
    if (!from_ext) {
      from_ext = "Extensible";
    }
    //account from
    var trans_from_account = TypeAccount(
      from_principal,
      from_id,
      from_ext
    );

    var to_principal = trans_to.principal;
    var to_id = trans_to.account_id;
    var to_ext = trans_to.extensible;
    if (!to_id) {
      to_id = "Id undefined";
    }
    if (!to_ext) {
      to_ext = "Extensible";
    }
    //account to
    var trans_to_account = TypeAccount(to_principal, to_id, to_ext);

    //Down here the accounts or principals of the transaction.
    //Need them for filter transaction using principal or account
    var array_accounts: string[] = [];
    array_accounts.push(
      getAccountId(from_principal._arr),
      getAccountId(to_principal._arr)
    );
    var array_principals: string[] = [];

    transactionObj = {
      trans_index: curr_obj.index.toString(),
      token_id: curr_obj.token_id,
      type_txn: _transaction_type_formatted,
      message: "Owner Transfer",
      accounts: removeDuplicates(array_accounts),
      principals: removeDuplicates(array_principals),
      to: trans_to_account,
      from: trans_from_account,
    };

    return (
        transactionObj
    )
};

export default OwnerTransfer;