import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      
      <div className='text-center pt-16 pb-8'>
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
          About Us
        </h1>
        <p className='text-gray-600 mt-3'>Discover our story and mission</p>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-2 gap-12 items-center mb-20'>
          
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity'></div>
            <img 
              className='relative w-full rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300' 
              src={assets.about_image} 
              alt="About" 
            />
          </div>

          <div className='space-y-6 text-gray-700'>
            <p className='leading-relaxed'>
              Welcome to <span className='font-semibold text-indigo-600'>CareHub Med</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p className='leading-relaxed'>
              CareHub Med is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, we're here to support you every step of the way.
            </p>
            
            <div className='bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg'>
              <div className='flex items-center gap-3 mb-3'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                <h3 className='text-xl font-bold'>Our Vision</h3>
              </div>
              <p className='text-white/90 leading-relaxed'>
                Our vision is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Why Choose Us
          </h2>
          <p className='text-gray-600 mt-2'>What makes us different</p>
        </div>

        <div className='grid md:grid-cols-3 gap-6 mb-20'>
          
          <div className='group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500'>
            <div className='w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors'>
              Efficiency
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          <div className='group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500'>
            <div className='w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors'>
              Convenience
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          <div className='group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500'>
            <div className='w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors'>
              Personalization
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default About