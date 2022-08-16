import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen, cleanup } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import testData from './data';

import { TransactionsTable } from '..';

describe('Components>TransactionsTable', () => {
  // Test1
  test('If is loading should display only preloader', () => {
    // Render
    render(<TransactionsTable isLoading={true} />);
    const Loader = screen.getByRole('progressbar');
    expect(Loader).toBeInTheDocument();
    cleanup();
  });
  // Test2
  test('If is not loading should display the table', () => {
    // Render
    render(<TransactionsTable isLoading={false} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test3
  test('If tokenId is not present show #Select a token Id', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'Not selected'} />);
    const Placeholder = screen.getByText('Select a Token ID');
    expect(Placeholder).toBeInTheDocument();
    cleanup();
  });
  // Test4
  test('If tokenId is present and there are transactions found show the table', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'#myId'} isEmpty={false} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test5  - This test is failing because the component is not rendering the table when there are no transactions found
  test('If tokenId is present and there are no transactions found show the table', () => {
    // Render
    render(<TransactionsTable searchBarTokenId={'#myId'} isEmpty={true} />);
    const Table = screen.getByLabelText('ogy_data_table');
    expect(Table).toBeInTheDocument();
    cleanup();
  });
  // Test6
  //take a snapshot of the component
  test('Snapshot', () => {
    const { asFragment } = render(<TransactionsTable isLoading={false} />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  } 
  );

});
