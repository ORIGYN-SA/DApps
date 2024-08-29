import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppMarketplace from '../../components/apps/marketplace/src/AppMarketplace';

export default function render() {
  return (
    <StrictMode>
      <AppMarketplace />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
