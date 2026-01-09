import { lazy, useContext, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Navbar from './components/Navbar'
import Sidebar from './components/SideBar'
import Footer from './components/Footer'

// Lazy loaded components  (no loaded all uis to the upfront just lead when needed one)
const Login = lazy(() => import('./pages/Login'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));

// Admin pages
const Dashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AllApointment = lazy(() => import('./pages/admin/AllAppointments'));
const AddDoctor = lazy(() => import('./pages/admin/AddDoctor'));
const DoctorsList = lazy(() => import('./pages/admin/DoctorsList'));

// Doctor pages
const DoctorDashboard = lazy(() => import('./pages/doctor/Dashboard'));
const DoctorApointment = lazy(() => import('./pages/doctor/DoctorAppointment'));
const DoctorProfile = lazy(() => import('./pages/doctor/DoctorProfile'));

// User pages
const Home = lazy(() => import('./pages/Home'));
const Doctor = lazy(() => import('./pages/Doctor'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const MyAppointment = lazy(() => import('./pages/MyAppointment'));
const Appointment = lazy(() => import('./pages/Appointment'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading Component
const LoadingFallback = () => (
  <div className='flex justify-center items-center h-screen'>
    <div className='text-center'>
      <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent'></div>
      <p className='mt-2 text-gray-600'>LOADING ...</p>
    </div>
  </div>
);

const App = () => {
  const aToken = useContext(AdminContext)?.aToken
  const dToken = useContext(DoctorContext)?.dToken

  const isAdmin = !!aToken   // convert boolean
  const isDoctor = !!dToken

  // Admin / Doctor Dashboard Layout
  if (isAdmin || isDoctor) {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start pt-[70px]'>
          <Sidebar />
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </div>
      </div>
    )
  }

  // Regular User Layout
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <div className='pt-[150px]'>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctor />} />
            <Route path='/doctors/:speciality' element={<Doctor />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/my-appointments' element={<MyAppointment />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </div>
  )
}

export default App