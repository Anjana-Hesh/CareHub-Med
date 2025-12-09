// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'
// import { login, register } from '../services/auth'
// import { DoctorContext } from '../context/DoctorContext'
// import { AdminContext } from '../context/AdminContext'

// interface LoginResponse {
//   data?: {
//     token?: string
//     refresh_token?: string
//     roles?: string[]
//     message?: string
//   }
// }

// interface RegisterResponse {
//   data?: {
//     message?: string
//     success?: boolean
//   }
// }

// type FormState = 'Sign Up' | 'Login'

// const Login: React.FC = () => {
//   const { token, setToken } = useContext(AppContext)
//   const { setDToken } = useContext(DoctorContext)!
//   const { setAToken } = useContext(AdminContext)!

//   const navigate = useNavigate()

//   const [state, setState] = useState<FormState>('Sign Up')
//   const [email, setEmail] = useState<string>('')
//   const [name, setName] = useState<string>('')
//   const [password, setPassword] = useState<string>('')
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   const handleForgetPasswordClick = () => navigate('/forget-password')

//   const onSubmitHandler = async (
//     event: React.FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     event.preventDefault()
//     setIsLoading(true)

//     try {
//       if (state === 'Sign Up') {
//         const data: RegisterResponse = await register(name, email, password)

//         toast.success(
//           data?.data?.message || 'Registration successful! Please login.'
//         )
//         setState('Login')
//         setPassword('')

//       } else {
       
//         const data: LoginResponse = await login(email, password)

//         if (data?.data?.token && data?.data?.roles) {
//           const roles = data.data.roles.map(r => r.toUpperCase())

//           localStorage.setItem('roles', JSON.stringify(roles))

//           if (roles.includes('ADMIN')) {
//             localStorage.setItem('aToken', data.data.token)
//             localStorage.setItem('refresh_token', data.data.refresh_token || '')
//             setAToken(data.data.token)
//             navigate('/admin-dashboard')
//             return
//           }

//           if (roles.includes('DOCTOR')) {
//             localStorage.setItem('dToken', data.data.token)
//             localStorage.setItem('refresh_token', data.data.refresh_token || '')
//             setDToken(data.data.token)
//             navigate('/doctor-dashboard')
//             return
//           }

//           localStorage.setItem('token', data.data.token)
//           localStorage.setItem('refresh_token', data.data.refresh_token || '')
//           setToken(data.data.token)
//           navigate('/')
//           return
//         }

//         toast.error(data?.data?.message || 'Invalid credentials!')
//       }

//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Something went wrong!')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (token) {
//       const roles: string[] =
//         JSON.parse(localStorage.getItem('roles') || '[]') || []

//       if (roles.includes('ADMIN')) navigate('/admin-dashboard')
//       else if (roles.includes('DOCTOR')) navigate('/doctor-dashboard')
//       else navigate('/')
//     }
//   }, [token, navigate])

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
//         <p className='text-2xl font-semibold m-auto'>
//           <span className='text-[#5F6FFF]'>
//             {state === 'Sign Up' ? 'Create Account' : 'Login'}
//           </span>
//         </p>
//         <p className='text-center w-full'>
//           Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
//         </p>

//         {state === 'Sign Up' && (
//           <div className='w-full'>
//             <p>Full Name</p>
//             <input
//               className='border border-[#DADADA] rounded w-full p-2 mt-1'
//               type='text'
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//               placeholder='Enter your full name'
//               required
//             />
//           </div>
//         )}

//         <div className='w-full'>
//           <p>Email</p>
//           <input
//             className='border border-[#DADADA] rounded w-full p-2 mt-1'
//             type='email'
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             placeholder='Enter your email'
//             required
//           />
//         </div>

//         <div className='w-full'>
//           <p>Password</p>
//           <input
//             className='border border-[#DADADA] rounded w-full p-2 mt-1'
//             type='password'
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             placeholder='Enter your password'
//             required
//             minLength={6}
//           />
//         </div>

//         <button
//           type='submit'
//           disabled={isLoading}
//           className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'
//         >
//           {isLoading
//             ? 'Please wait...'
//             : state === 'Sign Up'
//             ? 'Create Account'
//             : 'Login'}
//         </button>

//         {state === 'Sign Up' ? (
//           <p>
//             Already have an account?{' '}
//             <span
//               onClick={() => setState('Login')}
//               className='text-[#5F6FFF] underline cursor-pointer'
//             >
//               Login here
//             </span>
//           </p>
//         ) : (
//           <div className='w-full flex flex-col gap-2 mt-2'>
//             <p className='w-full text-center'>
//               Create a new account?{' '}
//               <span
//                 onClick={() => setState('Sign Up')}
//                 className='text-[#5F6FFF] underline cursor-pointer'
//               >
//                 Click here
//               </span>
//             </p>

//             <p className='w-full text-center text-sm text-gray-500'>
//               Forget Password?{' '}
//               <span
//                 onClick={handleForgetPasswordClick}
//                 className='text-[#5F6FFF] underline cursor-pointer'
//               >
//                 Change here
//               </span>
//             </p>
//           </div>
//         )}
//       </div>
//     </form>
//   )
// }

// export default Login

// ======================================================================================

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/auth'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

interface LoginResponse {
  data?: {
    token?: string
    refresh_token?: string
    roles?: string[]
    message?: string
  }
}

interface RegisterResponse {
  data?: {
    message?: string
    success?: boolean
  }
}

type FormState = 'Sign Up' | 'Login'

const Login: React.FC = () => {
  const { token, setToken } = useContext(AppContext)
  const { setDToken } = useContext(DoctorContext)!
  const { setAToken } = useContext(AdminContext)!

  const navigate = useNavigate()

  const [state, setState] = useState<FormState>('Login')
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleForgetPasswordClick = () => navigate('/forget-password')

  const onSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (state === 'Sign Up') {
        const data: RegisterResponse = await register(name, email, password)

        toast.success(
          data?.data?.message || 'Registration successful! Please login.'
        )
        setState('Login')
        setPassword('')
        setName('')
        setEmail('')

      } else {
        const data: LoginResponse = await login(email, password)

        if (data?.data?.token && data?.data?.roles) {
          const roles = data.data.roles.map(r => r.toUpperCase())

          localStorage.setItem('roles', JSON.stringify(roles))

          if (roles.includes('ADMIN')) {
            localStorage.setItem('aToken', data.data.token)
            localStorage.setItem('refresh_token', data.data.refresh_token || '')
            setAToken(data.data.token)
            navigate('/admin-dashboard')
            return
          }

          if (roles.includes('DOCTOR')) {
            localStorage.setItem('dToken', data.data.token)
            localStorage.setItem('refresh_token', data.data.refresh_token || '')
            setDToken(data.data.token)
            navigate('/doctor-dashboard')
            return
          }

          localStorage.setItem('token', data.data.token)
          localStorage.setItem('refresh_token', data.data.refresh_token || '')
          setToken(data.data.token)
          navigate('/')
          return
        }

        toast.error(data?.data?.message || 'Invalid credentials!')
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      const roles: string[] =
        JSON.parse(localStorage.getItem('roles') || '[]') || []

      if (roles.includes('ADMIN')) navigate('/admin-dashboard')
      else if (roles.includes('DOCTOR')) navigate('/doctor-dashboard')
      else navigate('/')
    }
  }, [token, navigate])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <style>
        {`
          input::placeholder {
            color: #CBD5E1;
            opacity: 1;
          }
        `}
      </style>
      <div className='w-full max-w-md'>
        <form 
          onSubmit={onSubmitHandler} 
          className='bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-3xl'
        >
          {/* Header with Icon */}
          <div className='text-center space-y-2'>
            <div className='w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg'>
              <svg 
                className='w-8 h-8 text-white' 
                fill='none' 
                stroke='currentColor' 
                viewBox='0 0 24 24'
              >
                {state === 'Sign Up' ? (
                  <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    strokeWidth={2} 
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' 
                  />
                ) : (
                  <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    strokeWidth={2} 
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
                  />
                )}
              </svg>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className='text-gray-600'>
              {state === 'Sign Up' 
                ? 'Join us to book your appointments easily' 
                : 'Please login to book your appointment'}
            </p>
          </div>

          {/* Form Fields */}
          <div className='space-y-5'>
            {state === 'Sign Up' && (
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                  <svg className='w-4 h-4 text-indigo-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                  Full Name
                </label>
                <input
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none hover:border-gray-300'
                  type='text'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder='John Doe'
                  required
                />
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <svg className='w-4 h-4 text-indigo-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                Email Address
              </label>
              <input
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none hover:border-gray-300'
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder='you@example.com'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <svg className='w-4 h-4 text-indigo-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
                Password
              </label>
              <input
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none hover:border-gray-300'
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder='••••••••'
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Forgot Password Link - Only on Login */}
          {state === 'Login' && (
            <div className='text-right -mt-2'>
              <button
                type='button'
                onClick={handleForgetPasswordClick}
                className='text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline'
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle 
                    className='opacity-25' 
                    cx='12' 
                    cy='12' 
                    r='10' 
                    stroke='currentColor' 
                    strokeWidth='4' 
                    fill='none'
                  />
                  <path 
                    className='opacity-75' 
                    fill='currentColor' 
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Processing...
              </span>
            ) : (
              state === 'Sign Up' ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>
                {state === 'Sign Up' ? 'Already a member?' : 'New to our platform?'}
              </span>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            type='button'
            onClick={() => {
              setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
              setEmail('')
              setName('')
              setPassword('')
            }}
            className='w-full py-3 border-2 border-indigo-200 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200'
          >
            {state === 'Sign Up' 
              ? 'Sign in to existing account' 
              : 'Create new account'}
          </button>
        </form>

        {/* Footer Note */}
        <p className='text-center text-sm text-gray-500 mt-6'>
          By continuing, you agree to our{' '}
          <span className='text-indigo-600 hover:underline cursor-pointer'>
            Terms of Service
          </span>
          {' '}and{' '}
          <span className='text-indigo-600 hover:underline cursor-pointer'>
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login