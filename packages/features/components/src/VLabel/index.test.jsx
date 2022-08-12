import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen, toBeInTheDocument } from '../../../../../testUtils';
import '@testing-library/jest-dom/extend-expect';
import { VersionLabel } from '.';

test('Check if the Version is displayed', () => {
    const { getByText } = render(<VersionLabel ledgerVersion="0.1.0"/>);
      expect(getByText("LEDGER - 0.1.0")).toBeInTheDocument();
  })