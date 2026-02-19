import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../design-kit/tokens.css'
import './index.css'
import App from './App.tsx'
import { AdminApp } from './AdminApp.tsx'

const pathname = window.location.pathname;
const isAdmin = pathname === '/admin' || pathname === '/admin/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)
