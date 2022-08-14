import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import '@testing-library/jest-dom';

import { SearchbarNft } from './index';

describe('Select-Autocomplete', () => {
  // Render
  render(<SearchbarNft />);

  // Test1
  const Select = screen.getByTestId('searchbar-component');
  test('CHECK THE RENDERING OF THE COMPONENT', () => {
    expect(console.log(Select))
  });


});
