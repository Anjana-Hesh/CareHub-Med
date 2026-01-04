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
  }, [dToken])

  // Calculate pagination
  const reversedAppointments = [...actualAppointments].reverse()
  const totalPages = Math.ceil(reversedAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = reversedAppointments.slice(startIndex, endIndex)

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

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 md:ml-70 w-full ml-10">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            All Appointments
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {startIndex + 1}–{Math.min(endIndex, reversedAppointments.length)} of {reversedAppointments.length}
            </p>
            {totalPages > 1 && (
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-200 text-center sm:text-left">
                <span className="text-sm text-gray-600">Page </span>
                <span className="text-lg font-bold text-indigo-600">{currentPage}</span>
                <span className="text-sm text-gray-600"> / {totalPages}</span>
              </div>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

          {/* Desktop Header - hidden on mobile */}
          <div className="hidden md:block bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="grid grid-cols-[40px_2.5fr_1fr_80px_2fr_1fr_160px] gap-4 text-white font-semibold text-sm">
              <p>#</p>
              <p>Patient</p>
              <p>Payment</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p className="text-center">Action</p>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((item, index) => (
                <div
                  key={item._id}
                  className="px-4 py-5 sm:px-6 hover:bg-indigo-50/40 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                          src={item.userData.image}
                          alt={item.userData.name}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.userData.name}</p>
                          <p className="text-sm text-gray-600">
                            {calculateAge(item.userData.dob)} years
                          </p>
                        </div>
                      </div>
                      <p className="text-right font-bold text-gray-800">
                        {currency} {item.amount}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs">Date & Time</span>
                        <p className="font-medium">{slotDateFormat(item.slotDate)} • {item.slotTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs">Payment</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          item.payment ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.payment ? 'Online' : 'Cash'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      {item.cancelled ? (
                        <span className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          Completed
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Complete"
                          >
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[40px_2.5fr_1fr_80px_2fr_1fr_160px] md:gap-4 md:items-center">
                    <p className="text-gray-500 font-semibold">
                      {String(startIndex + index + 1).padStart(2, '0')}
                    </p>

                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                        src={item.userData.image}
                        alt={item.userData.name}
                      />
                      <p className="font-semibold text-gray-800">{item.userData.name}</p>
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.payment ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.payment ? 'Online' : 'Cash'}
                      </span>
                    </div>

                    <p className="text-gray-600 font-medium">
                      {calculateAge(item.userData.dob)} yrs
                    </p>

                    <div>
                      <p className="font-medium text-gray-800">{slotDateFormat(item.slotDate)}</p>
                      <p className="text-sm text-gray-500">{item.slotTime}</p>
                    </div>

                    <p className="font-bold text-gray-800">
                      {currency} {item.amount}
                    </p>

                    <div className="flex justify-center gap-2">
                      {item.cancelled ? (
                        <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                          Completed
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4">
                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium text-lg">No appointments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-lg px-5 py-4 border border-gray-200">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex flex-wrap justify-center gap-2">
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all text-sm ${
                      currentPage === page
                        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium w-full sm:w-auto justify-center"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointment