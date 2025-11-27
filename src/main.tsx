// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.tsx'
import DoctorContextProvider from './context/DoctorContext.tsx'
import AdminContextProvider from './context/AdminContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <DoctorContextProvider>
      <AdminContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </AdminContextProvider>
    </DoctorContextProvider>
  </BrowserRouter>,
)
