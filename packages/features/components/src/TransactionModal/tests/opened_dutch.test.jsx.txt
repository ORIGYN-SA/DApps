import { render, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Transaction } from '..';
import {dutchData} from './data'

const props = {
  modalData: {
    trans_index: 'IndexTrx',
    token_id: 'TokenId',
    type_txn: 'Sale opened',
    message: 'Sale opened',
    accounts: 'AccountsHere',
    principals: 'PrincipalsHere',
    pricing_config: dutchData,
    type_of_pricing_config: 'dutch',
    sale_id:'saleId'
  },
};

describe('Component/TransactionModal/Sale opened - Conf : Dutch', () => {
  it('should display transaction values', () => {
    const { getByText } = render(Transaction(props));
    expect( screen.getByText(props.modalData.type_txn)).toBeInTheDocument();
    expect( screen.getByText(props.modalData.pricing_config.type_of_pricing_config.toUpperCase())).toBeInTheDocument();
    expect(screen.getByText(props.modalData.sale_id)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.pricing_config.start_price)).toBeInTheDocument();
    expect( screen.getByText(props.modalData.pricing_config.reserve)).toBeInTheDocument();
    expect(screen.getByText(props.modalData.pricing_config.decay_per_hour)).toBeInTheDocument();


  });
  //the render should match the snapshot
  it('should match the snapshot', () => {
    const { asFragment } = render(Transaction(props));
    expect(asFragment()).toMatchSnapshot();
  }
  );
});
