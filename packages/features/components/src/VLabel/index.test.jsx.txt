import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen } from '../../../../../testUtils';
import '@testing-library/jest-dom';
import { VersionLabel } from '.';

test('Check if the Version is displayed', () => {
    const { getByText } = render(<VersionLabel ledgerVersion="0.1.0"/>);
      expect(getByText("LEDGER - 0.1.0")).toBeInTheDocument();
  })