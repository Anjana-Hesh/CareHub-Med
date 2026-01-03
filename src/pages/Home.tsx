import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>

      <section className='animate-fade-in'>
        <Header />
      </section>

      <section className='py-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3'>
              Find by Speciality
            </h2>
            <p className='text-gray-600'>
              Browse through our wide range of medical specialties
            </p>
          </div>
          <SpecialityMenu />
        </div>
      </section>

      <section className='py-12 px-4 bg-white/50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3'>
              Top Doctors
            </h2>
            <p className='text-gray-600'>
              Meet our highly qualified and experienced doctors
            </p>
          </div>
          <TopDoctors />
        </div>
      </section>

      <section className='py-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          <Banner />
        </div>
      </section>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}
      </style>
    </div>
  )
}

export default Home