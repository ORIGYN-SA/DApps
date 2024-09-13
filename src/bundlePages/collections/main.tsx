import React from "react"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppCollections from '../../components/apps/collections/src/AppCollections.jsx';

export default function render() {
  return (
    <StrictMode>
      <AppCollections />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(render());
