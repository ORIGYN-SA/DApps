import { Transactions, PricingConfiguration, WaitForQuiet, formatTime } from '@dapp/utils';
import { getToken, removeDuplicates } from './TableFunctions';

export const SaleOpened = (
  obj_transaction,
  _props: string,
  transactionObj: Transactions,
  curr_obj,
  _transaction_type_formatted: string,
) => {
  const _extensible = obj_transaction[_props].extensible;
  const _sale_id = obj_transaction[_props].sale_id;
  const obj_pricing = obj_transaction[_props].pricing;

  let typeOfPricing: string;

  let InstantData: PricingConfiguration;
  let FlatData: PricingConfiguration;
  let DutchData: PricingConfiguration;
  let AuctionData: PricingConfiguration;

  for (typeOfPricing in obj_pricing) {
    if (obj_pricing.hasOwnProperty(typeOfPricing)) {
      switch (typeOfPricing) {
        case 'instant':
          InstantData = {
            txn_id: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            type_of_pricing_config: typeOfPricing,
          };

          // Down here the accounts or principals of the transaction.
          // Need them for filter transaction using principal or account
          var array_accounts: string[] = [];
          var array_principals: string[] = [];

          transactionObj = {
            trans_index: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            message: 'Sale opened',
            accounts: array_accounts,
            principals: array_principals,
            pricing_config: InstantData,
            type_of_pricing_config: typeOfPricing,
            sale_id: _sale_id,
          };

          break;

        case 'flat':
          var flat_token = obj_pricing[typeOfPricing].token;
          var tokenProps: string;
          let token_standard: string | undefined;
          let obj_token: any;

          for (tokenProps in flat_token) {
            var _canister = _token[tokenProps].canister;
            var _fee = flat_token[tokenProps].fee;
            var _symbol = flat_token[tokenProps].symbol;
            var _decimals = flat_token[tokenProps].decimals;
            var _standard = flat_token[tokenProps].standard;

            for (const prop of Object.keys(_standard)) {
              token_standard = prop;
            }
          }

          if (token_standard) {
            var local_obj_token = getToken(_canister, _fee, _symbol, _decimals, token_standard);
            obj_token = local_obj_token;
          }

          FlatData = {
            txn_id: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            type_of_pricing_config: typeOfPricing,
            amount: obj_pricing[typeOfPricing].amount,
            token: obj_token,
          };

          FlatData.token = obj_token;
          // Down here the accounts or principals of the transaction.
          // Need them for filter transaction using principal or account
          var array_accounts: string[] = [];

          var array_principals: string[] = [];
          array_principals.push(obj_token.canister_string);
          transactionObj = {
            trans_index: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            message: 'Sale opened',
            accounts: removeDuplicates(array_accounts),
            principals: removeDuplicates(array_principals),
            sale_id: _sale_id,
            extensible: _extensible,
            pricing_config: FlatData,
            type_of_pricing_config: typeOfPricing,
          };

          break;

        case 'dutch':
          DutchData = {
            txn_id: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            type_of_pricing_config: typeOfPricing,
            start_price: obj_pricing[typeOfPricing].start_price,
            decay_per_hour: obj_pricing[typeOfPricing].decay_per_hour,
            reserve: obj_pricing[typeOfPricing].reserve,
          };

          // Down here the accounts or principals of the transaction.
          // Need them for filter transaction using principal or account
          var array_accounts: string[] = [];
          var array_principals: string[] = [];

          transactionObj = {
            trans_index: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            message: 'Sale opened',
            accounts: removeDuplicates(array_accounts),
            principals: removeDuplicates(array_principals),
            sale_id: _sale_id,
            extensible: _extensible,
            pricing_config: DutchData,
            type_of_pricing_config: typeOfPricing,
          };

          break;

        case 'auction':
          var _reserve = obj_pricing[typeOfPricing].reserve;
          var _buyNow = obj_pricing[typeOfPricing].buy_now;
          var _startPrice = obj_pricing[typeOfPricing].start_price;
          var _startDate = formatTime(BigInt(obj_pricing[typeOfPricing].start_date));

          var _minIncrease = obj_pricing[typeOfPricing].min_increase;
          var minimum_increase: string;
          if (_minIncrease.hasOwnProperty('percentage')) {
            minimum_increase = _minIncrease.percentage;
          } else {
            minimum_increase = _minIncrease.amount;
          }

          var _ending = obj_pricing[typeOfPricing].ending;
          var ending_date: string | {};
          if (_ending.hasOwnProperty('date')) {
            ending_date = formatTime(BigInt(_ending.date));
          } else {
            const { wait_for_quiet } = _ending;
            var wait_props: string;
            let wfq_date: string | undefined;

            for (wait_props in wait_for_quiet) {
              if (wait_for_quiet[wait_props].hasOwnProperty('date')) {
                wfq_date = formatTime(BigInt(wait_for_quiet[wait_props].date));
                var wfq_extention = wait_for_quiet[wait_props].extention;
                var wfq_fade = wait_for_quiet[wait_props].fade;
                var wfq_max = wait_for_quiet[wait_props].max;
              }
            }

            const obj_wfq: WaitForQuiet = {
              date: wfq_date ? wfq_date : '',
              extention: wfq_extention,
              fade: wfq_fade,
              max: wfq_max,
            };

            ending_date = obj_wfq;
          }

          var _token = obj_pricing[typeOfPricing].token;
          var tokenProps: string;
          let obj_token_auction: any; //add correct type

          for (tokenProps in _token) {
            var _canister = _token[tokenProps].canister;
            var _fee = _token[tokenProps].fee;
            var _symbol = _token[tokenProps].symbol;
            var _decimals = _token[tokenProps].decimals;
            var _standard = _token[tokenProps].standard;

            for (const prop of Object.keys(_standard)) {
              token_standard = prop;
            }
          }

          if (token_standard) {
            obj_token_auction = getToken(_canister, _fee, _symbol, _decimals, token_standard);
          }
          AuctionData = {
            txn_id: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            type_of_pricing_config: typeOfPricing,
            token: obj_token_auction,
            ending_date,
            min_increase: minimum_increase,
            start_date: _startDate,
            start_price: _startPrice,
            buy_now: _buyNow[0],
            reserve: _reserve[0],
          };

          // Down here the accounts or principals of the transaction.
          // Need them for filter transaction using principal or account
          var array_accounts: string[] = [];

          var array_principals: string[] = [];
          array_principals.push(obj_token.canister_string);
          transactionObj = {
            trans_index: curr_obj.index.toString(),
            token_id: curr_obj.token_id,
            type_txn: _transaction_type_formatted,
            message: 'Sale opened',
            accounts: removeDuplicates(array_accounts),
            principals: removeDuplicates(array_principals),
            extensible: _extensible,
            sale_id: _sale_id,
            pricing_config: AuctionData,
          };

          break;

        case 'extensible':
          // console.log('extensible');

          break;
      }
    }
  }
  return transactionObj;
};
