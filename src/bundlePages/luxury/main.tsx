import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppLuxury from '../../components/apps/luxury/src/AppLuxury';

export default function render() {
  return (
    <StrictMode>
      <AppLuxury />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
