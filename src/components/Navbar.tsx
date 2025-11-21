// import React, { useContext, useState } from 'react'
// import {assets} from '../assets/assets'
// import { NavLink, useNavigate } from 'react-router-dom'
// import { AppContext } from '../context/AppContext';

// const Navbar = () => {

//     const navigate = useNavigate();

//     const [showMenu , setShowMenu] = useState(false)
//     // const [token , setToken] = useState(true)
//     const { token , setToken, userData} = useContext(AppContext)
//     const [showDropdown, setShowDropdown] = useState(false)

//     const logout = () => {
//         navigate('/login')
//         localStorage.removeItem('token')
//         setToken("")
//     }

//   return (
//     <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
//         <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="logo" />
//         <ul className='hidden md:flex items-start gap-5 font-medium'>
//             <NavLink to='/'>
//                 <li className='py-1'>HOME</li>
//                 <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
//             </NavLink>

//             <NavLink to='/doctors'>
//                 <li className='py-1'>ALL DOCTORS</li>
//                 <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
//             </NavLink>

//             <NavLink to='/about'>
//                 <li className='py-1'>ABOUT</li>
//                 <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden' />
//             </NavLink>

//             <NavLink to='/contact'>
//                 <li className='py-1'>CONTACT</li>
//                 <hr className='border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden'/>
//             </NavLink>
//         </ul>
//         <div className='flex items-center gap-4'>
//             {
//                 token && userData
//                 ? 
//                 <div onClick={() => setShowDropdown(!showDropdown)} className='flex items-center gap-2 cursor-pointer group relative'>
//                     <img className='w-8 rounded-full' src={userData.image} alt="Profile picture" />
//                     <img className='w-2.5' src={assets.dropdown_icon} alt="Drop down icon" />
//                     <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${showDropdown ? 'block' : 'hidden'} group-hover:block`}>
//                         <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                             <p onClick={()=> navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
//                             <p onClick={()=> navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
//                             <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
//                         </div>
//                     </div>
//                 </div> 
//                 :
//                 <button onClick={() => navigate('/login')} className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
//             }
//             <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu icon" />
            
//             {/*  ----------- Mobile menu ---------- */}
//             <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
//                 <div className='flex items-center justify-between px-5 py-6'>
//                     <img className='w-36' src={assets.logo} alt="Logo" />
//                     <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Cross Icon" />
//                 </div>
//                 <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
//                     <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
//                     <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
//                     <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
//                     <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
//                 </ul>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Navbar

import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Logout function
  const logout = () => {
    if (aToken) { setAToken(''); localStorage.removeItem('aToken'); }
    if (dToken) { setDToken(''); localStorage.removeItem('dToken'); }
    if (token) { setToken(''); localStorage.removeItem('token'); }
    localStorage.removeItem('roles');
    navigate('/login');
  };

  // Determine current role
  let role: 'ADMIN' | 'DOCTOR' | 'USER' | null = null;
  if (aToken) role = 'ADMIN';
  else if (dToken) role = 'DOCTOR';
  else if (token) role = 'USER';

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white'>
      <img
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt='Logo'
        onClick={() => navigate('/')}
      />

      {/* Desktop links */}
      <ul className='hidden md:flex items-center gap-5 font-medium'>
        <NavLink to='/'><li>HOME</li></NavLink>
        {role === 'USER' && <NavLink to='/doctors'><li>ALL DOCTORS</li></NavLink>}
        <NavLink to='/about'><li>ABOUT</li></NavLink>
        <NavLink to='/contact'><li>CONTACT</li></NavLink>
        {role === 'ADMIN' && <NavLink to='/admin-dashboard'><li>DASHBOARD</li></NavLink>}
        {role === 'DOCTOR' && <NavLink to='/doctor-dashboard'><li>DASHBOARD</li></NavLink>}
      </ul>

      {/* Right side */}
      <div className='flex items-center gap-4'>
        {role ? (
          <div className='relative flex items-center gap-2'>
            {role === 'USER' && userData?.image && (
              <img
                src={userData.image}
                alt='Profile'
                className='w-8 h-8 rounded-full cursor-pointer'
                onClick={() => setShowDropdown(!showDropdown)}
              />
            )}
            <p className='font-medium'>{role}</p>
            {(role !== 'USER') && (
              <button
                onClick={logout}
                className='bg-[#5f6FFF] text-white px-6 py-2 rounded-full'
              >
                Logout
              </button>
            )}

            {/* Dropdown for USER */}
            {role === 'USER' && showDropdown && (
              <div className='absolute right-0 top-full mt-2 bg-white shadow-md rounded w-48 flex flex-col z-20'>
                <p
                  className='p-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => { navigate('/my-profile'); setShowDropdown(false); }}
                >
                  My Profile
                </p>
                <p
                  className='p-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => { navigate('/my-appointments'); setShowDropdown(false); }}
                >
                  My Appointments
                </p>
                <p
                  className='p-2 hover:bg-gray-100 cursor-pointer'
                  onClick={logout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full'
          >
            Login / Sign Up
          </button>
        )}

        {/* Mobile menu toggle */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='Menu'
        />
      </div>

      {/* Mobile menu */}
      <div className={`${showMenu ? 'fixed w-full h-full' : 'h-0 w-0'} top-0 right-0 z-30 overflow-hidden bg-white transition-all md:hidden`}>
        <div className='flex items-center justify-between px-5 py-6'>
          <img src={assets.logo} alt='Logo' className='w-36' />
          <img
            src={assets.cross_icon}
            alt='Close'
            className='w-7 cursor-pointer'
            onClick={() => setShowMenu(false)}
          />
        </div>
        <ul className='flex flex-col items-center gap-4 mt-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to='/'><li>HOME</li></NavLink>
          {role === 'USER' && <NavLink onClick={() => setShowMenu(false)} to='/doctors'><li>ALL DOCTORS</li></NavLink>}
          <NavLink onClick={() => setShowMenu(false)} to='/about'><li>ABOUT</li></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><li>CONTACT</li></NavLink>
          {role === 'ADMIN' && <NavLink onClick={() => setShowMenu(false)} to='/admin-dashboard'><li>DASHBOARD</li></NavLink>}
          {role === 'DOCTOR' && <NavLink onClick={() => setShowMenu(false)} to='/doctor-dashboard'><li>DASHBOARD</li></NavLink>}
          {role && role !== 'USER' && <li><button onClick={logout} className='bg-[#5f6FFF] text-white px-6 py-2 rounded-full'>Logout</button></li>}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
