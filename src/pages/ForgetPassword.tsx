import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { sendPasswordResetEmail } from '../services/auth'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleForgetPassword = async (event: FormEvent ) => {
    event.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address.')
      return
    }

    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await sendPasswordResetEmail(email)
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (response.success) {
      
      const successMessage = '✅ A password reset link has been sent to your email address.'
      setMessage(successMessage)
      toast.success(successMessage)
      setEmail('')
      } else {
        toast.error(response.message || 'Failed to send reset link.')
      }
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
    
  }

  return (
    <form onSubmit={handleForgetPassword} className='min-h-[80vh] flex items-center justify-center py-10'>
      <div className='flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-2xl bg-white'>
        
        <p className='text-3xl font-bold m-auto'>
          <span className='text-[#5F6FFF]'>
            Forgot Password
          </span>
        </p>
        
        <p className='text-center w-full text-gray-600 mb-3'>
          Enter your email address to receive a **password reset link**.
        </p>

        {message && (
          <div className='w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center'>
            {message}
          </div>
        )}

        <div className='w-full'>
          <p className='font-medium text-gray-700'>Email</p>
          <input
            className='border border-[#DADADA] rounded w-full p-3 mt-1 focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent transition-shadow'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Enter your registered email'
            required
            disabled={isLoading}
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='bg-[#5F6FFF] text-white w-full py-3 rounded-md text-lg font-semibold hover:bg-[#4F5FEF] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg'
        >
          {isLoading
            ? 'Sending link...'
            : 'Send Reset Link'}
        </button>

        <p className='w-full text-center mt-2'>
          Remember your password?{' '}
          <Link
            to='/login'
            className='text-[#5F6FFF] underline cursor-pointer font-medium hover:text-[#4F5FEF] transition-colors'
          >
            Go back to Login
          </Link>
        </p>
      </div>
    </form>
  )
}

export default ForgetPassword