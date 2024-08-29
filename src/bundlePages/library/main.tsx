import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppLibrary from '../../components/apps/library/src/AppLibrary';

export default function render() {
  return (
    <StrictMode>
      <AppLibrary />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
