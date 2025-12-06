import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/auth';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Missing password reset token. Please use the link from your email.");
    } else {
      console.log('Reset token from URL:', token);
      console.log('Token length:', token.length);
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return toast.error("Reset token is missing.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);

    try {
      console.log('Attempting password reset with token:', token);
      console.log('New password length:', password.length);

      const response = await resetPassword(token, password);

      if (response.success) {
        toast.success(response.message || 'Password reset successfully! Please log in.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Password reset failed.');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An error occurred. The link may be expired.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4'>
      <div className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Reset Password
          </h1>
          <p className='text-gray-600 text-sm'>
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label 
              htmlFor='password' 
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              New Password
            </label>
            <input
              id='password'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Minimum 6 characters'
              required
              minLength={6}
              disabled={isLoading}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100'
            />
          </div>

          <div>
            <label 
              htmlFor='confirmPassword' 
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder='Re-enter new password'
              required
              disabled={isLoading}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Updating password...' : 'Set New Password'}
          </button>

          <div className='text-center pt-4'>
            <Link 
              to='/login' 
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition'
            >
              Cancel and Go to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;