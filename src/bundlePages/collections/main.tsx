import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CollectionsApp from '../../components/apps/collections/src/CollectionsApp.jsx'

export default function render () {
  return (
    <StrictMode>
      <CollectionsApp />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(render())
