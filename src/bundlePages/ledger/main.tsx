import React from "react"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppLedger from '../../components/apps/ledger/src/AppLedger';

export default function render() {
  return (
    <StrictMode>
      <AppLedger />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
