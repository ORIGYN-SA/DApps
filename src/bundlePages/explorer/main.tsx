import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ExplorerApp from '../../components/apps/explorer/src/ExplorerApp.jsx'

export default function render () {
  return (
    <StrictMode>
      <ExplorerApp />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(render())
