import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { HashRouter } from 'react-router-dom'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App></App>
  </HashRouter>
)
