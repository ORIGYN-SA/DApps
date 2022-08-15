module.exports = { 
    obj_token :  {
        canister_string : '#canisterString',
        fee : '#fee',
        symbol : 'ICP',
        decimal : '#decimal',
        standard : '#standard'
    },
    trans_to_account : {
      acc_principal_string : 'principalTo',
      acc_id : 'idTo',
      acc_extensible : 'no'
    },
    trans_from_account : {
      acc_principal_string : 'principalFrom',
      acc_id : 'idFrom',
      acc_extensible : 'no'
    },
    buyer_account : {
      acc_principal_string : 'principalBuyer',
      acc_id : 'idBuyer',
      acc_extensible : 'no'
    },
    seller_account : {
      acc_principal_string : 'principalSeller',
      acc_id : 'idSeller',
      acc_extensible : 'no'
    },
    dep_trx : {
      _nat: '#nat',
      _text: '#text',
      _extensible:'#no',
    }
}