
import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppVault from '../../components/apps/vault/src/AppVault';

export default function render() {
  return (
    <StrictMode>
      <AppVault />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
