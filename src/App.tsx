import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import { AppContext } from './context/AppContext'

import Navbar from './components/Navbar'
import Sidebar from './components/SideBar'
import Footer from './components/Footer'

import Login from './pages/Login'
import ForgetPassword from './pages/ForgetPassword'

// Admin pages
import Dashboard from './pages/admin/AdminDashboard'
import AllApointment from './pages/admin/AllAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'

// Doctor pages
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorApointment from './pages/doctor/DoctorAppointment'
import DoctorProfile from './pages/doctor/DoctorProfile'

// User pages
import Home from './pages/Home'
import Doctor from './pages/Doctor'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const { token } = useContext(AppContext)

  const isAdmin = !!aToken
  const isDoctor = !!dToken
  const isUser = !!token

  // Admin / Doctor Dashboard Layout
  if (isAdmin || isDoctor) {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            {/* Admin Routes */}
            {isAdmin && (
              <>
                <Route path='/' element={<DoctorDashboard />} />
                <Route path='/admin-dashboard' element={<Dashboard />} />
                <Route path='/all-appointments' element={<AllApointment />} />
                <Route path='/add-doctor' element={<AddDoctor />} />
                <Route path='/doctor-list' element={<DoctorsList />} />
              </>
            )}

            {/* Doctor Routes */}
            {isDoctor && (
              <>
                <Route path='/' element={<DoctorDashboard />} />
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorApointment />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    )
  }

  // Regular User Layout
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/reset-password/:token' element={<ForgetPassword />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-appointments' element={<MyAppointment />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
