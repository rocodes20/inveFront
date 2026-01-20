import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Imports the traffic controller we just made
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)