export const ic = {
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
};
export const trans_to_account = {
  acc_principal_string: 'principalTo',
  acc_id: 'idTo',
  acc_extensible: 'no'
};
export const trans_from_account = {
  acc_principal_string: 'principalFrom',
  acc_id: 'idFrom',
  acc_extensible: 'no'
};
export const buyer_account = {
  acc_principal_string: 'principalBuyer',
  acc_id: 'idBuyer',
  acc_extensible: 'no'
};
export const seller_account = {
  acc_principal_string: 'principalSeller',
  acc_id: 'idSeller',
  acc_extensible: 'no'
};
export const dep_trx = {
  _nat: '#nat',
  _text: '#text',
  _extensible: '#no',
};

export const wit_trx = {
  _nat: '#nat',
  _text: '#text',
  _extensible: '#no',
};

export const sale_wit_trx = {
  _nat: '#nat',
  _text: '#text',
  _extensible: '#no',
};


export const Token = {
  canister_string: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  fee: '10000',
  symbol: 'ICP',
  decimal: '8',
  standard: 'LEDGER'}

 export const sale_obj = {
    token: 'Token not defined',
    amount: 'AMOUNT'
  };

  export const instantData = {
    txn_id: 'ID',
    token_id: 'ID TOKEN',
    type_txn: 'SALE OPENED',
    type_of_pricing_config: 'instant',
  }

  export const dutchData = {
    txn_id: 'ID',
    token_id: 'ID TOKEN',
    type_txn:  'SALE OPENED',
    type_of_pricing_config: 'dutch',
    start_price: 'START PRICE',
    decay_per_hour: 'DECAY PER HOUR',
    reserve: 'RESERVE',
  }

  export const flatData = {
    txn_id: 'ID',
    token_id: 'ID TOKEN',
    type_txn: 'SALE OPENED',
    type_of_pricing_config: 'flat',
    amount: 'AMOUNT',
    token: Token
  }

  export const auctionData = {
    txn_id: 'ID',
    token_id: 'ID TOKEN',
    type_txn: 'SALE OPENED',
    type_of_pricing_config: 'auction',
    token: Token,
    ending_date : 'ENDING DATE',
    min_increase: 'MIN INCREASE',
    start_date:   'START DATE',
    start_price: 'START PRICE',
    buy_now: 'BUY NOW',
    reserve: 'RESERVE',
  }