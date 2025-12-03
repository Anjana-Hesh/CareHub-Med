import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/auth'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Login = () => {
  const { token, setToken } = useContext(AppContext)
  // const { refresh_token , setRefresh_token} = useContext(AppContext)
  const {dToken , setDToken} = useContext(DoctorContext)
  const { aToken , setAToken} = useContext(AdminContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleForgetPasswordClick = () => {
    navigate('/forget-password') 
  }

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setIsLoading(true)

  try {
    if (state === 'Sign Up') {
      // Register new user
      const data = await register(name, email, password)

      // if (data?.data?.success || data?.success) {
        toast.success(data?.data?.message || 'Registration successful! Please login.')
        setState('Login')
        setPassword('')
      // } else {
      //   toast.error(data?.data?.message || 'Registration failed')
      // }

    } else {
      
       const data = await login(email, password)

      if (data?.data?.token && data?.data?.roles) {
        const roles = data.data.roles.map(r => r.toUpperCase())
        
        // DEBUG: Check the actual values
        console.log('🟢 Roles array:', roles)
        console.log('🟢 roles.includes("DOCTOR"):', roles.includes('DOCTOR'))
        console.log('🟢 roles[0] === "DOCTOR":', roles[0] === 'DOCTOR')
        console.log('🟢 typeof roles[0]:', typeof roles[0])
        
        localStorage.setItem('roles', JSON.stringify(roles))
        // localStorage.setItem('token', data.data.token)
        // setToken(data.data.token)

        // If doctor, save in DoctorContext
        if (roles.includes('DOCTOR')) {
          console.log('🟢 Setting doctor token')
          // setDToken(data.data.token)
        }

        // FIXED: Better role checking
        if (roles.includes('ADMIN')) {
          console.log('➡️ Navigating to ADMIN dashboard')
          localStorage.setItem('aToken', data.data.token)
          localStorage.setItem('refresh_token',data.data.refresh_token)
          setAToken(data.data.token)
          navigate('/admin-dashboard')
        } else if (roles.includes('DOCTOR') || roles[0] === 'DOCTOR') {
          console.log('➡️ Navigating to DOCTOR dashboard')
          localStorage.setItem('dToken', data.data.token)
          localStorage.setItem('refresh_token',data.data.refresh_token)
          setDToken(data.data.token)
          navigate('/doctor-dashboard')
        } else {
          console.log('➡️ Navigating to USER home')
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('refresh_token',data.data.refresh_token)
          setToken(data.data.token)
          navigate('/')
        }
        
      } else {
        toast.error(data?.data?.message || 'Invalid credentials')
      }
    }

  } catch (error: any) {
    console.error('Authentication error:', error)
    toast.error(error?.response?.data?.message || error.message || 'An error occurred')
  } finally {
    setIsLoading(false)
  }
}

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]')
      if (roles.includes('ADMIN')) navigate('/admin-dashboard')
      else if (roles.includes('DOCTOR')) navigate('/doctor/dashboard')
      else navigate('/')
    }
  }, [token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-[#5F6FFF]'>
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </span>
        </p>
        <p className='text-center w-full'>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Enter your full name'
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Enter your email'
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Enter your password'
            required
            minLength={6}
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base hover:bg-[#4F5FEF] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {isLoading
            ? 'Please wait...'
            : state === 'Sign Up'
            ? 'Create Account'
            : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-[#5F6FFF] underline cursor-pointer'
            >
              Login here
            </span>
          </p>
        ) : (
          <div className='w-full flex flex-col gap-2 mt-2'>
            <p className='w-full text-center'>
              Create a new account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className='text-[#5F6FFF] underline cursor-pointer font-medium hover:text-[#4F5FEF] transition-colors'
              >
                Click here
              </span>
            </p>

            <p className='w-full text-center text-sm text-gray-500'>
              Forget Password?{' '}
              <span
                onClick={handleForgetPasswordClick}
                className='text-[#5F6FFF] underline cursor-pointer font-medium hover:text-[#4F5FEF] transition-colors'
              >
                Change here
              </span>
            </p>
          </div>
        )}
      </div>
    </form>
  )
}

export default Login