import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './CSS/Variables.css'
import './CSS/layoutDesign.css'
import './CSS/componentsDesign.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
