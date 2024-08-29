import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppNftData from '../../components/apps/nft-data/src/AppNftData';

export default function render() {
  return (
    <StrictMode>
      <AppNftData />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());

