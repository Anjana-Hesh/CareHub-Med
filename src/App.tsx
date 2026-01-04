// import { lazy, useContext, Suspense } from 'react'
// import { Route, Routes } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// import { AdminContext } from './context/AdminContext'
// import { DoctorContext } from './context/DoctorContext'
// // import { AppContext } from './context/AppContext'

// import Navbar from './components/Navbar'
// import Sidebar from './components/SideBar'
// import Footer from './components/Footer'

// // import Login from './pages/Login'
// const Login = lazy (() => import('./pages/Login'));       // In normal import the all uis load to upfront when lead app starts but in lazy loading the particular component will load when it is required.
// // import ForgetPassword from './pages/ForgetPassword'
// const ForgetPassword = lazy (() => import('./pages/ForgetPassword') );

// // Admin pages
// // import Dashboard from './pages/admin/AdminDashboard'
// const Dashboard = lazy (() => import('./pages/admin/AdminDashboard') );
// // import AllApointment from './pages/admin/AllAppointments'
// const AllApointment = lazy (() => import('./pages/admin/AllAppointments') );
// // import AddDoctor from './pages/admin/AddDoctor'
// const AddDoctor = lazy (() => import('./pages/admin/AddDoctor') );
// // import DoctorsList from './pages/admin/DoctorsList'
// const DoctorsList = lazy (() => import('./pages/admin/DoctorsList') );

// // Doctor pages
// // import DoctorDashboard from './pages/doctor/Dashboard'
// const DoctorDashboard = lazy (() => import('./pages/doctor/Dashboard') );
// // import DoctorApointment from './pages/doctor/DoctorAppointment'
// const DoctorApointment = lazy (() => import('./pages/doctor/DoctorAppointment') );
// // import DoctorProfile from './pages/doctor/DoctorProfile'
// const DoctorProfile = lazy (() => import('./pages/doctor/DoctorProfile') );

// // User pages
// // import Home from './pages/Home'
// const Home = lazy (() => import('./pages/Home') );
// // import Doctor from './pages/Doctor'
// const Doctor = lazy (() => import('./pages/Doctor') );
// // import About from './pages/About'
// const About = lazy (() => import('./pages/About') );
// // import Contact from './pages/Contact'
// const Contact = lazy (() => import('./pages/Contact'));
// // import MyProfile from './pages/MyProfile'
// const MyProfile = lazy (() => import('./pages/MyProfile'));
// // import MyAppointment from './pages/MyAppointment'
// const MyAppointment = lazy (() => import('./pages/MyAppointment'));
// // import Appointment from './pages/Appointment'
// const Appointment = lazy (() => import('./pages/Appointment'));
// // import ResetPassword from './pages/ResetPassword'
// const ResetPassword = lazy (() => import('./pages/ResetPassword'));

// const App = () => {
//   const aToken = useContext(AdminContext)?.aToken
//   const dToken = useContext(DoctorContext)?.dToken
//   // const { token } = useContext(AppContext)

//   const isAdmin = !!aToken   // value convert to boolean
//   const isDoctor = !!dToken
//   // const isUser = !!token

//   // Admin / Doctor Dashboard Layout
  
//   if (isAdmin || isDoctor) {
//     return (
//       <div className='bg-[#F8F9FD]'>
//         <ToastContainer />
//         <Navbar />
//         <div className='flex items-start pt-[70px]'>
//           <Sidebar />
//           <Routes>
//             {/* Admin Routes */}
//             {isAdmin && (
//               <>
//                 <Route path='/' element={<DoctorDashboard />} />
//                 <Route path='/admin-dashboard' element={<Dashboard />} />
//                 <Route path='/all-appointments' element={<AllApointment />} />
//                 <Route path='/add-doctor' element={<AddDoctor />} />
//                 <Route path='/doctor-list' element={<DoctorsList />} />
//               </>
//             )}

//             {/* Doctor Routes */}
//             {isDoctor && (
//               <>
//                 <Route path='/' element={<DoctorDashboard />} />
//                 <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
//                 <Route path='/doctor-appointments' element={<DoctorApointment />} />
//                 <Route path='/doctor-profile' element={<DoctorProfile />} />
//               </>
//             )}
//           </Routes>
//         </div>
//       </div>
//     )
//   }
  

//   // Regular User Layout
//   return (
//     <div className='mx-4 sm:mx-[10%]'>
//       <ToastContainer />
//       <Navbar />
//       <div className='pt-[150px]'>
//         <Routes>
//           <Route path='/' element={<Home />} />
//           <Route path='/doctors' element={<Doctor />} />
//           <Route path='/doctors/:speciality' element={<Doctor />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='/forget-password' element={<ForgetPassword />} />
//           <Route path='/reset-password/:token' element={<ResetPassword />} />
//           <Route path='/about' element={<About />} />
//           <Route path='/contact' element={<Contact />} />
//           <Route path='/my-appointments' element={<MyAppointment />} />
//           <Route path='/my-profile' element={<MyProfile />} />
//           <Route path='/appointment/:docId' element={<Appointment />} />
//         </Routes>
//         <Footer />
//       </div>
//     </div>
//   )
// }

// export default App



import { lazy, useContext, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Navbar from './components/Navbar'
import Sidebar from './components/SideBar'
import Footer from './components/Footer'

// Lazy loaded components
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
      <p className='mt-2 text-gray-600'>පූරණය වෙමින්...</p>
    </div>
  </div>
);

const App = () => {
  const aToken = useContext(AdminContext)?.aToken
  const dToken = useContext(DoctorContext)?.dToken

  const isAdmin = !!aToken
  const isDoctor = !!dToken

  // Admin / Doctor Dashboard Layout
  if (isAdmin) {
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