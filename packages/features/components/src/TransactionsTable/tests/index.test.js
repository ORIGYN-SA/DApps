import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import { Transactions } from '@dapp/utils';

import { Mint } from '../functions/Mint';

import testData from './data';
it('MINT FUNCTION - Returns Mint transaction correctly', () => {
  const mintResult = {
    trans_index: '0',
    token_id: 'bm-1',
    type_txn: 'Mint',
    message: 'Mint',
    accounts: ['92335d6272f9f32fcf5ca1586e1d8893581099c3436d5d1f59ab3751c6709282'],
    principals: [],
    mint_from: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
    mint_to: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
    sale: {
      token: 'Token not defined',
      amount: 'Amount not defined',
    }
  };

  const mintFunction = Mint(
    testData.mint.enter_in_trans,
    testData.mint.props,
    Transactions,
    testData.mint.historyNFT,
    testData.mint.transaction_type_formatted,
  );
  expect(mintFunction).toStrictEqual(mintResult);
});

