import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter } from 'react-router-dom'
import Login from './components/Login.jsx'


createRoot(document.getElementById('root')).render(
  // Wrap your app with BrowserRouter
  <StrictMode>
    <BrowserRouter> 
      <App/>
    </BrowserRouter>
  </StrictMode>,
)
