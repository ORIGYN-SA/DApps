//Interface transaction
export interface Transactions {
    //Common
    trans_index: string;
    token_id: string;
    type_txn: string;
    message: string;
    accounts: string[];
    principals: string[];
    //Specs
    buyer?: {};
    amount?: string;
    token?: {};
    sale_id?: string;
    mint_from?: string;
    mint_to?: string;
    sale?: {};
    seller?: {};
    pricing_config?: {};
    type_of_pricing_config?: string;
    extensible?: {};
    to?: {};
    from?: {};
    fee?: string;
    trx_id?: {};

}
//Interface pricingconfiguration
export interface PricingConfiguration {
    //Common
    txn_id: string;
    token_id: string;
    type_txn: string;
    type_of_pricing_config: string;
    //Specs
    amount?: string;
    token?: {};
    start_price?: string;
    decay_per_hour?: string;
    reserve?: string;
    start_date?: string;
    ending_date?: {};
    buy_now?: string;
    min_increase?: string;
}
//interface Sale
export interface Sale {
    token?: string | {};
    amount?: string;
}
//interface row
export interface Row {
    index: string;
    date: string;
    id_token: string;
    type_txn: string;
}

export interface WaitForQuiet {
    date: string;
    extention: string;
    fade: string;
    max: string;
}

export interface TypeTransactionId { 
    _nat: string;
    _text: string;
    _extensible: string
}
