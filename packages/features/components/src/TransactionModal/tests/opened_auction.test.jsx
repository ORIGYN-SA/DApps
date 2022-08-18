import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import {auctionData} from './data'

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Sale opened',
    message: 'Sale opened',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    pricing_config: auctionData,
    type_of_pricing_config: 'auction',
    sale_id:'saleId'
  },
};

describe('Component/TransactionModal/Sale opened - Conf : Flat', () => {
  it('should display transaction values', () => {
    const { getByText } = render(Transaction(props));
    screen.getByText(props.modalData.type_txn);
    screen.getByText(props.modalData.pricing_config.type_of_pricing_config.toUpperCase());
    screen.getByText(props.modalData.sale_id);
    
    screen.getByText(props.modalData.pricing_config.reserve);
    screen.getByText(props.modalData.pricing_config.buy_now);
    screen.getByText(props.modalData.pricing_config.min_increase);
    screen.getByText(props.modalData.pricing_config.start_date);
    screen.getByText(props.modalData.pricing_config.ending_date);
    screen.getByText(props.modalData.pricing_config.start_date);

    screen.getByText(props.modalData.pricing_config.token.canister_string);
    screen.getByText(props.modalData.pricing_config.token.fee);
    screen.getByText(props.modalData.pricing_config.token.decimal);
    screen.getByText(props.modalData.pricing_config.token.standard);


  });
  //the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});
