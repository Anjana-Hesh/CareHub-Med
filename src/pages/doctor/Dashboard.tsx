import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assetsAdmin'
import jsPDF from 'jspdf'

interface UserData {
  name: string
  image?: string
}

interface Appointment {
  _id: string
  userData: UserData
  slotDate: string
  cancelled: boolean
  isCompleted: boolean
}

interface DashData {
  earnings: number
  appointments: number
  patients: number
  latestAppointments: Appointment[]
}

interface ExtendedDoctorContextType {
  dashData: DashData | false
  getDashData: () => Promise<void>
  completeAppointment: (appointmentId: string) => Promise<void>
  cancelAppointment: (appointmentId: string) => Promise<void>
}

const DoctorDashboard = () => {
  const doctorContext = useContext(DoctorContext)
  const appContext = useContext(AppContext)
  
  if (!doctorContext || !appContext) {
    throw new Error('Context must be used within providers')
  }

  const { dashData, getDashData, completeAppointment, cancelAppointment } = doctorContext as unknown as ExtendedDoctorContextType
  const { currency, slotDateFormat } = appContext
  
  const [showReport, setShowReport] = useState<boolean>(false)
  const token = localStorage.getItem("dToken")

  useEffect(() => {
    if (token) {
      getDashData()
    }
  }, [token, getDashData])

  const generateReportPreview = () => {
    setShowReport(true)
  }

  const downloadPDF = () => {
    if (!dashData) return

    const doc = new jsPDF()

    doc.setFontSize(24)
    doc.setTextColor(33, 150, 243)
    doc.text("Doctor Dashboard Report", 10, 15)

    doc.setFontSize(14)
    doc.setTextColor(51, 51, 51)
    doc.text(`Earnings: ${currency}${dashData.earnings}`, 10, 35)
    doc.text(`Appointments: ${dashData.appointments}`, 10, 45)
    doc.text(`Patients: ${dashData.patients}`, 10, 55)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Latest Appointments:", 10, 75)

    let y = 85
    dashData.latestAppointments.forEach((item: Appointment, index: number) => {
      const statusText = item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Pending"
      const statusColor: [number, number, number] = item.cancelled 
        ? [255, 0, 0] 
        : item.isCompleted 
        ? [0, 128, 0] 
        : [255, 165, 0]

      doc.setTextColor(51, 51, 51)
      const mainText = `${index + 1}. ${item.userData.name} - ${slotDateFormat(item.slotDate)}`
      doc.text(mainText, 10, y)
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
      doc.text(`- ${statusText}`, 10, y + 5)
      
      y += 12
    })

    doc.save("doctor_dashboard_report.pdf")
  }

  if (!dashData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className='m-5'>
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={generateReportPreview}
          className='bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition duration-200 flex items-center gap-2'
        >
          <img src={assets.list_icon} alt="Report" className='w-5' />
          Generate Report
        </button>
      </div>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="Earnings" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency}{dashData.earnings}</p>
            <p className='text-gray-400'>Total Earning</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white mt-10'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="List" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item: Appointment, index: number) => (
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                  <img className='rounded-full w-10' src={item.userData.image} alt={item.userData.name} />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                    <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                  </div>

                  {
                    item.cancelled
                      ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                      : item.isCompleted
                        ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                        : <div className='flex gap-2'>
                            <button
                              onClick={() => cancelAppointment(item._id)}
                              className='p-2 rounded-full hover:bg-red-100 transition-colors'
                              title='Cancel Appointment'
                            >
                              <img className='w-5' src={assets.cancel_icon} alt="Cancel" />
                            </button>
                            <button
                              onClick={() => completeAppointment(item._id)}
                              className='p-2 rounded-full hover:bg-green-100 transition-colors'
                              title='Mark as Completed'
                            >
                              <img className='w-5' src={assets.tick_icon} alt="Complete" />
                            </button>
                          </div>
                  }
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500'>
                No latest bookings found.
              </div>
            )
          }
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              📊 Dashboard Report Preview
            </h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Overview</h3>
              <p className="text-gray-700">Earnings: {currency}{dashData.earnings}</p>
              <p className="text-gray-700">Total Appointments: {dashData.appointments}</p>
              <p className="text-gray-700">Total Patients: {dashData.patients}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Latest Appointments ({dashData.latestAppointments.length})
              </h3>
              <div className="space-y-3">
                {dashData.latestAppointments.map((item: Appointment, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-800">{item.userData.name}</p>
                    <p className="text-sm text-gray-600">Date: {slotDateFormat(item.slotDate)}</p>
                    <p className="text-sm">
                      Status: {item.cancelled 
                        ? <span className="text-red-500 font-medium">Cancelled</span> 
                        : item.isCompleted 
                        ? <span className="text-green-500 font-medium">Completed</span> 
                        : <span className="text-orange-500 font-medium">Pending</span>
                      }
                    </p>
                  </div>
                ))}
                {dashData.latestAppointments.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No appointments to report.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowReport(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Close
              </button>
              <button
                onClick={downloadPDF}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-primary-dark transition duration-200"
              >
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