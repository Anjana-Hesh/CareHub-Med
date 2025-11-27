import { useContext, useState } from 'react';
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

  const logout = () => {
    if (aToken) { setAToken(''); localStorage.removeItem('aToken'); }
    if (dToken) { setDToken(''); localStorage.removeItem('dToken'); }
    if (token) { setToken(''); localStorage.removeItem('token'); }
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('roles');
    navigate('/login');
  };

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

      <ul className='hidden md:flex items-center gap-5 font-medium'>
        <NavLink to='/'><li>HOME</li></NavLink>
        {role === 'USER' && <NavLink to='/doctors'><li>ALL DOCTORS</li></NavLink>}
        <NavLink to='/about'><li>ABOUT</li></NavLink>
        <NavLink to='/contact'><li>CONTACT</li></NavLink>
        {role === 'ADMIN' && <NavLink to='/admin-dashboard'><li>DASHBOARD</li></NavLink>}
        {role === 'DOCTOR' && <NavLink to='/doctor-dashboard'><li>DASHBOARD</li></NavLink>}
      </ul>

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

        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='Menu'
        />
      </div>

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
