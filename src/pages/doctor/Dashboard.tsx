import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assetsAdmin'
import jsPDF from 'jspdf'

const DoctorDashboard = () => {

  const { dashData, getDashData, completeAppointment, doctorCancelAppintmentsService } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  const [showReport, setShowReport] = useState(false)

  const token = localStorage.getItem("dToken")

  useEffect(() => {
    if (token) {
      getDashData()
    }
  }, [token])

  const generateReportPreview = () => {
    setShowReport(true)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

  // Main Title --------------  
    doc.setFontSize(24)
    doc.setTextColor(33, 150, 243) // A primary blue color
    doc.text("Doctor Dashboard Report", 10, 15)

  // Summary Details -------------  
    doc.setFontSize(14)
    doc.setTextColor(51, 51, 51) // Dark gray for text
    doc.text(`Earnings: ${currency}${dashData.earnings}`, 10, 35)
    doc.text(`Appointments: ${dashData.appointments}`, 10, 45)
    doc.text(`Patients: ${dashData.patients}`, 10, 55)

  // Latest Appointments -----------------  
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0) // Black for section title
    doc.text("Latest Appointments:", 10, 75)
    
    let y = 85
    dashData.latestAppointments.forEach((item: any, index: any) => {
      let statusText = item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Pending"
      let statusColor = item.cancelled ? [255, 0, 0] : item.isCompleted ? [0, 128, 0] : [255, 165, 0] // Red, Green, Orange
      
      doc.setTextColor(51, 51, 51)
      doc.text(`${index + 1}. ${item.userData.name} - ${slotDateFormat(item.slotDate)} - `, 10, y)
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
      let textWidth = doc.getStringUnitWidth(`${index + 1}. ${item.userData.name} - ${slotDateFormat(item.slotDate)} - `) * doc.internal.getFontSize() / doc.internal.scaleFactor
      doc.text(statusText, 10 + textWidth, y)
      
      y += 8
    })

    doc.save("doctor_dashboard_report.pdf")
  }


  return dashData && (
    <div className='p-6 bg-gray-50 min-h-screen'>

      <button 
        onClick={generateReportPreview}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mb-8 shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m5 1h.5a2 2 0 012 2v5a2 2 0 01-2 2h-2.5m-14 0h-2a2 2 0 01-2-2v-5a2 2 0 012-2h2.5m10 0a2 2 0 002 2v5a2 2 0 002-2h-2m-14 0a2 2 0 01-2-2v-5a2 2 0 012-2h2"></path></svg>
        Generate Report
      </button>

      <div className='flex flex-wrap gap-6'>
      
        <div className='flex items-center gap-4 bg-white p-6 w-full sm:w-56 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-xl hover:border-indigo-200'>
          <img className='w-12 h-12 p-2 bg-indigo-100 rounded-full' src={assets.earning_icon} alt="Earning Icon" />
          <div>
            <p className='text-3xl font-bold text-indigo-600'>{currency}{dashData.earnings}</p>
            <p className='text-sm font-medium text-gray-500 mt-1'>Total Earning</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-6 w-full sm:w-56 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-xl hover:border-green-200'>
          <img className='w-12 h-12 p-2 bg-green-100 rounded-full' src={assets.appointment_icon} alt="Appointment Icon" />
          <div>
            <p className='text-3xl font-bold text-green-600'>{dashData.appointments}</p>
            <p className='text-sm font-medium text-gray-500 mt-1'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-6 w-full sm:w-56 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-xl hover:border-red-200'>
          <img className='w-12 h-12 p-2 bg-red-100 rounded-full' src={assets.patients_icon} alt="Patient Icon" />
          <div>
            <p className='text-3xl font-bold text-red-600'>{dashData.patients}</p>
            <p className='text-sm font-medium text-gray-500 mt-1'>Patients</p>
          </div>
        </div>

      </div>

      <div className='bg-white mt-10 rounded-xl shadow-lg'>
      
        <div className='flex items-center gap-3 px-6 py-4 border-b rounded-t-xl bg-gray-50'>
          <img src={assets.list_icon} alt="List Icon" className='w-6 h-6 text-indigo-600'/>
          <p className='text-lg font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-gray-100'>
          {
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item: any, index: any) => (
                <div className='flex items-center px-6 py-4 gap-4 transition-colors duration-150 hover:bg-indigo-50/50' key={index}>
                  
                  <img className='rounded-full w-10 h-10 object-cover border-2 border-indigo-100' src={item.userData.image} alt="User" />
                  
                  <div className='flex-1 text-sm'>
                    <p className='text-base font-semibold text-gray-800'>{item.userData.name}</p>
                    <p className='text-sm text-gray-500'>{slotDateFormat(item.slotDate)}</p>
                  </div>

                  {
                    item.cancelled
                      ? <span className='px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full'>Cancelled</span>
                      : item.isCompleted
                        ? <span className='px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full'>Completed</span>
                        : <div className='flex items-center gap-1'>
                            <button
                              onClick={() => doctorCancelAppintmentsService(item._id)}
                              className='p-2 rounded-full hover:bg-red-100 transition-colors'
                              title='Cancel Appointment'
                            >
                              <img className='w-6 h-6' src={assets.cancel_icon} alt="Cancel" />
                            </button>
                            <button
                              onClick={() => completeAppointment(item._id)}
                              className='p-2 rounded-full hover:bg-green-100 transition-colors'
                              title='Mark as Completed'
                            >
                              <img className='w-6 h-6' src={assets.tick_icon} alt="Complete" />
                            </button>
                          </div>
                  }

                </div>
              ))
            ) : (
              <p className='text-center py-8 text-gray-500'>No latest bookings found.</p>
            )
          }
        </div>

      </div>



      {/* ====================================
                REPORT PREVIEW MODAL
      ===================================== */}
      {showReport && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">

            <h2 className="text-2xl font-bold text-indigo-600 border-b pb-3 mb-4">📊 Dashboard Report Preview</h2>

            <div className="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto pr-3">

              <div className='bg-indigo-50 p-3 rounded-lg'>
                <p className='text-lg font-semibold text-gray-800'>Overview</p>
                <p><strong>Earnings:</strong> <span className='font-bold text-indigo-700'>{currency}{dashData.earnings}</span></p>
                <p><strong>Total Appointments:</strong> {dashData.appointments}</p>
                <p><strong>Total Patients:</strong> {dashData.patients}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 border-b pb-2">Latest Appointments ({dashData.latestAppointments.length})</h3>
              
              {dashData.latestAppointments.map((item, i) => (
                <div key={i} className="border p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <p className='font-bold text-base text-gray-900'>{item.userData.name}</p>
                  <p className='text-xs text-gray-500'>Date: {slotDateFormat(item.slotDate)}</p>
                  <p className='text-xs mt-1'>Status: 
                    {item.cancelled
                      ? <span className='font-semibold text-red-600'> Cancelled</span>
                      : item.isCompleted
                        ? <span className='font-semibold text-green-600'> Completed</span>
                        : <span className='font-semibold text-yellow-600'> Pending</span>}
                  </p>
                </div>
              ))}
              {dashData.latestAppointments.length === 0 && <p className='text-center text-gray-500'>No appointments to report.</p>}

            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <button 
                onClick={() => setShowReport(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Close
              </button>

              <button 
                onClick={downloadPDF}
                className="px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  )
}

export default DoctorDashboard