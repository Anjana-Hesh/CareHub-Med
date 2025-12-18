// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.tsx'
import DoctorContextProvider from './context/DoctorContext.tsx'
import AdminContextProvider from './context/AdminContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <DoctorContextProvider>
        <AdminContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </AdminContextProvider>
      </DoctorContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
