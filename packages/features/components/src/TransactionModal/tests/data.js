module.exports = { 
 ic :  {
    "fee": "10000",
    "decimals": "8",
    "canister": {
        "_arr": {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 2,
            "8": 1,
            "9": 1
        },
        "_isPrincipal": true
    },
    "standard": {
        "Ledger": null
    },
    "symbol": "ICP"
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