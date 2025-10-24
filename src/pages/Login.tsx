// import React, { useState } from 'react';

// const Login = () => {
//     // State to toggle between "Sign Up" and "Login" views
//     const [state, setState] = useState('Sign Up');

//     // State to hold form data (consolidated into one object for cleaner management)
//     const [data, setData] = useState({
//         name: "",
//         email: "",
//         password: ""
//     });

//     // Handle input changes
//     const onChangeHandler = (event) => {
//         const name = event.target.name;
//         const value = event.target.value;
//         setData(prevData => ({ ...prevData, [name]: value }));
//     };

//     // Handle form submission
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         console.log("Form Submitted:", data);
        
//         // --- Add your API call logic here ---
//         // Example: if (state === 'Sign Up') { /* signup API call */ }
//         // Example: else { /* login API call */ }
//     };

//     return (
//         // Container to center the form on the page
//         <div className='login-page min-h-[80vh] flex items-center justify-center p-4'> 
//             <form onSubmit={onSubmitHandler} className='login-container w-full max-w-md p-8 sm:p-10 rounded-xl shadow-lg bg-white border border-gray-200'>
                
//                 {/* Header */}
//                 <h2 className='text-3xl font-semibold mb-6 text-gray-800'>
//                     {state === 'Sign Up' ? "Create Account" : "Login"}
//                 </h2>

//                 {/* Input Fields */}
//                 <div className='flex flex-col gap-4'>
                    
//                     {/* Name field (only for Sign Up) */}
//                     {state === 'Sign Up' ? (
//                         <input
//                             name='name'
//                             onChange={onChangeHandler}
//                             value={data.name}
//                             type="text"
//                             placeholder="Your Name"
//                             required={state === 'Sign Up'}
//                             className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
//                         />
//                     ) : null}

//                     {/* Email field */}
//                     <input
//                         name='email'
//                         onChange={onChangeHandler}
//                         value={data.email}
//                         type="email"
//                         placeholder="Your Email"
//                         required
//                         className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
//                     />

//                     {/* Password field */}
//                     <input
//                         name='password'
//                         onChange={onChangeHandler}
//                         value={data.password}
//                         type="password"
//                         placeholder="Password"
//                         required
//                         className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
//                     />
//                 </div>

//                 {/* Submit Button */}
//                 <button 
//                     type='submit'
//                     className='mt-6 w-full py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors'
//                 >
//                     {state === 'Sign Up' ? "Sign Up" : "Login"}
//                 </button>

//                 {/* Toggle Link */}
//                 <div className='mt-4 text-center text-sm text-gray-600'>
//                     {state === 'Sign Up' ? (
//                         <p>Already have an account? 
//                             <span onClick={() => setState('Login')} className='text-indigo-600 font-medium cursor-pointer ml-1 hover:underline'>
//                                 Login here
//                             </span>
//                         </p>
//                     ) : (
//                         <p>Don't have an account? 
//                             <span onClick={() => setState('Sign Up')} className='text-indigo-600 font-medium cursor-pointer ml-1 hover:underline'>
//                                 Sign Up here
//                             </span>
//                         </p>
//                     )}
//                 </div>
                
//             </form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react'

const Login = () => {

  const [state , setState] = useState('Sign Up')

  const[email , setEmail] = useState('')
  const[name , setName] = useState('')
  const[password , setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  }

  return (
    <div>
        <form className='min-h-[80vh] flex items-center'>
          <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
            <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
            <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
            {
              state === "Sign Up" && 
              <div className='w-full'>
                <p>Full Name</p>
                <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
              </div>
            }

            <div className='w-full'>
              <p>Email</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            </div>
            <button className='bg-[#5f6FFF] text-white w-full py-2 row-gap-md text-base rounded'>
              {state === 'Sign Up' ? "Create Account" : "Login" }
            </button>
            {
              state === "Sign Up"
              ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-[#5f6FFF] underline cursor-pointer'>Login here</span></p>
              : <p>Create an new account? <span onClick={() => setState('Sign Up')}className='text-[#5f6FFF] underline cursor-pointer'>click here </span></p>
            }
          </div>
        </form>
    </div>
  )
}

export default Login
