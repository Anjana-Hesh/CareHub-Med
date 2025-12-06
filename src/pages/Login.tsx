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

  const [state, setState] = useState<FormState>('Sign Up')
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
          className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'
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
                className='text-[#5F6FFF] underline cursor-pointer'
              >
                Click here
              </span>
            </p>

            <p className='w-full text-center text-sm text-gray-500'>
              Forget Password?{' '}
              <span
                onClick={handleForgetPasswordClick}
                className='text-[#5F6FFF] underline cursor-pointer'
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
