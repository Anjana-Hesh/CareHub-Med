import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const { aToken, setAToken } = useContext(AdminContext)!;
  const { dToken, setDToken } = useContext(DoctorContext)!;

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
    <div className='flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b bg-white shadow-sm'>
      <img
        className='w-36 sm:w-40 lg:w-44 cursor-pointer'
        src={assets.logo}
        alt='Logo'
        onClick={() => navigate('/')}
      />

      <ul className='hidden md:flex items-center gap-3 lg:gap-5 font-medium text-sm lg:text-base'>
        {role === 'USER' && <NavLink to='/' className='hover:text-[#5f6FFF] transition-colors'><li>HOME</li></NavLink>}
        {role === 'USER' && <NavLink to='/doctors' className='hover:text-[#5f6FFF] transition-colors'><li>ALL DOCTORS</li></NavLink>}
        {role === 'USER' && <NavLink to='/about' className='hover:text-[#5f6FFF] transition-colors'><li>ABOUT</li></NavLink>}
        {role === 'USER' && <NavLink to='/contact' className='hover:text-[#5f6FFF] transition-colors'><li>CONTACT</li></NavLink>}
        {role === 'ADMIN' && <NavLink to='/admin-dashboard' className='hover:text-[#5f6FFF] transition-colors'><li>DASHBOARD</li></NavLink>}
        {role === 'DOCTOR' && <NavLink to='/doctor-dashboard' className='hover:text-[#5f6FFF] transition-colors'><li>DASHBOARD</li></NavLink>}
      </ul>

      <div className='flex items-center gap-2 sm:gap-4'>
        {role ? (
          <div className='relative flex items-center gap-2'>
            {role === 'USER' && userData?.image && (
              <img
                src={userData.image}
                alt='Profile'
                className='w-8 h-8 rounded-full cursor-pointer object-cover border-2 border-gray-200 hover:border-[#5f6FFF] transition-colors'
                onClick={() => setShowDropdown(!showDropdown)}
              />
            )}
            <p className='font-medium text-sm lg:text-base hidden sm:block'>{role}</p>
            
            {(role === 'ADMIN' || role === 'DOCTOR') && (
              <button
                onClick={logout}
                className='hidden md:block bg-[#5f6FFF] hover:bg-[#4e5fd9] text-white px-4 lg:px-6 py-2 rounded-full transition-colors text-sm lg:text-base'
              >
                Logout
              </button>
            )}

            {role === 'USER' && showDropdown && (
              <>
                <div 
                  className='fixed inset-0 z-10' 
                  onClick={() => setShowDropdown(false)}
                />
                <div className='absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-48 flex flex-col z-20 border border-gray-100 overflow-hidden'>
                  <p
                    className='p-3 hover:bg-gray-50 cursor-pointer text-sm transition-colors'
                    onClick={() => { navigate('/my-profile'); setShowDropdown(false); }}
                  >
                    My Profile
                  </p>
                  <p
                    className='p-3 hover:bg-gray-50 cursor-pointer text-sm transition-colors border-t border-gray-100'
                    onClick={() => { navigate('/my-appointments'); setShowDropdown(false); }}
                  >
                    My Appointments
                  </p>
                  <p
                    className='p-3 hover:bg-gray-50 cursor-pointer text-sm text-red-600 transition-colors border-t border-gray-100'
                    onClick={logout}
                  >
                    Logout
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#5f6FFF] hover:bg-[#4e5fd9] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full text-sm lg:text-base transition-colors'
          >
            <span className='hidden sm:inline'>Login / Sign Up</span>
            <span className='sm:hidden'>Login</span>
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt='Menu'
        />
      </div>

      {/* Mobile Menu */}
      <div className={`${showMenu ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 w-full h-full z-30 bg-white transition-transform duration-300 ease-in-out md:hidden`}>
        <div className='flex items-center justify-between px-5 py-6 border-b'>
          <img src={assets.logo} alt='Logo' className='w-36' />
          <img
            src={assets.cross_icon}
            alt='Close'
            className='w-7 cursor-pointer hover:opacity-70 transition-opacity'
            onClick={() => setShowMenu(false)}
          />
        </div>
        <ul className='flex flex-col items-center gap-6 mt-10 px-5 text-lg font-medium'>
          {role === 'USER' && (
            <>
              <NavLink onClick={() => setShowMenu(false)} to='/' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
                <li>HOME</li>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
                <li>ALL DOCTORS</li>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
                <li>ABOUT</li>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
                <li>CONTACT</li>
              </NavLink>
            </>
          )}
          {role === 'ADMIN' && (
            <NavLink onClick={() => setShowMenu(false)} to='/admin-dashboard' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
              <li>DASHBOARD</li>
            </NavLink>
          )}
          {role === 'DOCTOR' && (
            <NavLink onClick={() => setShowMenu(false)} to='/doctor-dashboard' className='w-full text-center py-2 hover:text-[#5f6FFF] transition-colors'>
              <li>DASHBOARD</li>
            </NavLink>
          )}
          {role && (
            <li className='mt-4'>
              <button 
                onClick={logout} 
                className='bg-[#5f6FFF] hover:bg-[#4e5fd9] text-white px-8 py-3 rounded-full transition-colors'
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;