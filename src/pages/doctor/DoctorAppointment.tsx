import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

interface UserData {
  name: string
  image: string
  dob: string
}

interface ActualAppointment {
  _id: string
  userData: UserData
  payment: boolean
  slotDate: string
  slotTime: string
  amount: number
  cancelled: boolean
  isCompleted: boolean
}

const DoctorAppointment = () => {
  const doctorContext = useContext(DoctorContext)
  const appContext = useContext(AppContext)

  if (!doctorContext || !appContext) {
    throw new Error('Context must be used within providers')
  }

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = doctorContext
  const { calculateAge, slotDateFormat, currency } = appContext

  const actualAppointments = appointments as unknown as ActualAppointment[]
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken, getAppointments])

  // Calculate pagination
  const reversedAppointments = [...actualAppointments].reverse()
  const totalPages = Math.ceil(reversedAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = reversedAppointments.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 ml-70 w-full'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            All Appointments
          </h1>
          <div className='flex items-center justify-between'>
            <p className='text-gray-600'>
              Showing {startIndex + 1} to {Math.min(endIndex, reversedAppointments.length)} of {reversedAppointments.length} appointments
            </p>
            <div className='bg-white px-4 py-2 rounded-lg shadow-md border-2 border-indigo-200'>
              <span className='text-sm text-gray-600'>Page </span>
              <span className='text-lg font-bold text-indigo-600'>{currentPage}</span>
              <span className='text-sm text-gray-600'> of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100'>
          
          {/* Table Header */}
          <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4'>
            <div className='hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2fr_1fr_1.5fr] gap-4 text-white font-semibold'>
              <p>#</p>
              <p>Patient</p>
              <p>Payment</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p className='text-center'>Action</p>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-100'>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((item, index) => (
                <div 
                  className='px-6 py-4 hover:bg-indigo-50 transition-colors'
                  key={item._id}
                >
                  <div className='grid md:grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2fr_1fr_1.5fr] gap-4 items-center'>
                    
                    {/* Index */}
                    <p className='hidden md:block text-gray-500 font-semibold'>
                      {String(startIndex + index + 1).padStart(2, '0')}
                    </p>

                    {/* Patient */}
                    <div className='flex items-center gap-3'>
                      <img 
                        className='w-12 h-12 rounded-full object-cover border-2 border-indigo-200' 
                        src={item.userData.image} 
                        alt={item.userData.name} 
                      />
                      <div>
                        <p className='font-semibold text-gray-800'>{item.userData.name}</p>
                        <p className='text-xs text-gray-500 md:hidden'>
                          {calculateAge(item.userData.dob)} years
                        </p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.payment 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.payment ? (
                          <>
                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                              <path fillRule='evenodd' d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z' clipRule='evenodd' />
                            </svg>
                            Online
                          </>
                        ) : (
                          <>
                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                            </svg>
                            Cash
                          </>
                        )}
                      </span>
                    </div>

                    {/* Age */}
                    <p className='hidden md:block text-gray-600 font-medium'>
                      {calculateAge(item.userData.dob)} yrs
                    </p>

                    {/* Date & Time */}
                    <div>
                      <p className='text-gray-800 font-medium text-sm'>
                        {slotDateFormat(item.slotDate)}
                      </p>
                      <p className='text-gray-500 text-xs'>{item.slotTime}</p>
                    </div>

                    {/* Fees */}
                    <p className='text-gray-800 font-bold'>
                      {currency} {item.amount}
                    </p>

                    {/* Action */}
                    <div className='flex justify-center gap-2'>
                      {item.cancelled ? (
                        <span className='px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold'>
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className='px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold'>
                          Completed
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className='p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group'
                            title='Cancel Appointment'
                          >
                            <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className='p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group'
                            title='Mark as Completed'
                          >
                            <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-16'>
                <svg className='w-20 h-20 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                <p className='text-gray-500 font-medium'>No appointments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg px-6 py-4 border-2 border-gray-100'>
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Previous
            </button>

            <div className='flex gap-2'>
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className='px-4 py-2 text-gray-500'>
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold'
            >
              Next
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointment