import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      
      <div className='text-center pt-16 pb-8'>
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          Contact Us
        </h1>
        <p className='text-gray-600 mt-3'>We'd love to hear from you</p>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity'></div>
            <img 
              className='relative w-full rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300' 
              src={assets.contact_image} 
              alt="Contact" 
            />
          </div>

          <div className='space-y-8'>
            
            <div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold text-gray-800'>Our Office</h2>
              </div>
              <div className='space-y-3 text-gray-600'>
                <p className='flex items-start gap-2'>
                  <svg className='w-5 h-5 text-indigo-500 mt-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                  <span>45/23 Kuruduwaththa Station<br />Suite 350, Colombo, Sri Lanka</span>
                </p>
                <p className='flex items-center gap-2'>
                  <svg className='w-5 h-5 text-indigo-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                  </svg>
                  <span>(+94) 764-810851</span>
                </p>
                <p className='flex items-center gap-2'>
                  <svg className='w-5 h-5 text-indigo-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <span>carehubmed.colombo@gmail.com</span>
                </p>
              </div>
            </div>

            <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <h2 className='text-2xl font-bold'>Join Our Team</h2>
              </div>
              <p className='mb-6 text-white/90'>
                Learn more about our teams and exciting job openings at CareHub Med.
              </p>
              <button className='bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg'>
                Explore Careers
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact