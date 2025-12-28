import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2';

interface UserData {
  name: string
  image?: string
  phone?: string
}

interface Appointment {
  _id: string
  userData: UserData
  slotDate: string
  slotTime: string
  cancelled: boolean
  isCompleted: boolean
}

interface DashData {
  earnings: number
  appointments: number
  patients: number
  latestAppointments: Appointment[]
}

// Date eka ada ho pass date ekakda kiyala check kirima
const isDateReached = (slotDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ada dawase welawa zero karanna
  
  const appointmentDate = new Date(slotDate);
  return appointmentDate <= today;
};

const DoctorDashboard = () => {
  const doctorContext = useContext(DoctorContext)
  const appContext = useContext(AppContext)
  
  const { dashData, getDashData, completeAppointment, cancelAppointment } = doctorContext as any
  const { currency, slotDateFormat } = appContext
  
  const [showReport, setShowReport] = useState(false)
  const [reportRange, setReportRange] = useState('today')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    getDashData()
  }, [])

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`
  }

  const getStatusColor = (appointment: Appointment) => {
    if (appointment.cancelled) return 'bg-red-50 text-red-700 border-red-200'
    if (appointment.isCompleted) return 'bg-green-50 text-green-700 border-green-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const getStatusText = (appointment: Appointment) => {
    if (appointment.cancelled) return 'Cancelled'
    if (appointment.isCompleted) return 'Completed'
    return 'Upcoming'
  }

  const downloadPDF = async () => {
    if (!dashData) return
    
    setIsGeneratingPDF(true)   // loading status manage
    
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4')
      
      doc.setFillColor(59, 130, 246)      
      doc.rect(0, 0, 210, 40, 'F')        // Drow a rectangle
                                          // Parameters:
                                            // 0 = x position (left margin) - 0mm
                                            // 0 = y position (top margin) - 0mm  
                                            // 210 = width (A4 paper width - 210mm)
                                            // 40 = height (header height - 40mm)
                                            // 'F' = Fill mode 
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('DOCTOR DASHBOARD REPORT', 105, 25, { align: 'center' })
      
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 35, { align: 'center' })
      doc.text(`Period: ${reportRange.charAt(0).toUpperCase() + reportRange.slice(1)}`, 105, 42, { align: 'center' })
      
      let yPosition = 55
      
      doc.setFillColor(239, 246, 255)
      doc.roundedRect(15, yPosition, 180, 30, 3, 3, 'F')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('PERFORMANCE SUMMARY', 20, yPosition + 10)
      
      yPosition += 35
      
      const statsData = [
        ['Total Earnings', formatCurrency(dashData.earnings)],
        ['Appointments', dashData.appointments.toString()],
        ['Patients', dashData.patients.toString()]
      ]
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: statsData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 12, cellPadding: 6 },
        columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 60 } }
      })
      
      yPosition = (doc as any).lastAutoTable.finalY + 20
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text('RECENT APPOINTMENTS', 15, yPosition)
      
      yPosition += 10
      
      const appointmentsData = dashData.latestAppointments.map((item: Appointment, index: number) => [
        (index + 1).toString(),
        item.userData.name,
        slotDateFormat(item.slotDate),
        item.slotTime,
        getStatusText(item)
      ])
      
      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Patient', 'Date', 'Time', 'Status']],
        body: appointmentsData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 45 }
        },
        didDrawCell: (data: any) => {    // color changed for status
          if (data.section === 'body' && data.column.index === 4) {
            const status = data.cell.raw
            if (status === 'Cancelled') {
              data.cell.styles.textColor = [239, 68, 68]
            } else if (status === 'Completed') {
              data.cell.styles.textColor = [34, 197, 94]
            } else {
              data.cell.styles.textColor = [59, 130, 246]
            }
          }
        }
      })
      
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(100, 116, 139)
        doc.text(`Page ${i} of ${pageCount}`, 195, 287, { align: 'right' })
        doc.text('© Medical System', 15, 287)
      }
      
      doc.save(`doctor-report-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsGeneratingPDF(false)
      setShowReport(false)
    }
  }

  if (!dashData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center ml-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ml-70 w-full">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's your practice overview</p>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Earnings Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Total Earnings</p>
                <p className="text-3xl font-bold">{formatCurrency(dashData.earnings)}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-blue-100">This month</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 mb-2">Appointments</p>
                <p className="text-3xl font-bold">{dashData.appointments}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-emerald-100">{dashData.latestAppointments.filter((a: Appointment) => !a.cancelled).length} upcoming</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-2">Total Patients</p>
                <p className="text-3xl font-bold">{dashData.patients}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-purple-100">Active patients this month</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
                Recent Appointments
              </h2>
              <span className="text-sm text-gray-500">
                Showing {dashData.latestAppointments.length} appointments
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Patient</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashData.latestAppointments.length > 0 ? (
                  dashData.latestAppointments.map((item: Appointment, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                            {item.userData.image ? (
                              <img src={item.userData.image} alt={item.userData.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-600">👤</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.userData.name}</p>
                            {item.userData.phone && (
                              <p className="text-sm text-gray-500">{item.userData.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900">{slotDateFormat(item.slotDate)}</p>
                        <p className="text-sm text-gray-500">{item.slotTime}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(item)}`}>
                          {getStatusText(item)}
                        </span>
                      </td>
                      <td className="p-4">
                        {!item.cancelled && !item.isCompleted && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (!isDateReached(item.slotDate)) {
                                  // Date eka thama awith nathnam alert eka danna
                                  Swal.fire({
                                    icon: 'info',
                                    title: 'Wait a moment!',
                                    text: `The appointment date (${slotDateFormat(item.slotDate)}) has not arrived yet. You can only mark it as complete on the scheduled day.`,
                                    confirmButtonColor: '#5f6FFF',
                                  });
                                } else {
                                  // Date eka hari nam pamanak complete function eka run karanna
                                  completeAppointment(item._id);
                                }
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-shadow text-sm"
                            >
                              Mark Complete
                            </button>
                            <button
                              onClick={() => cancelAppointment(item._id)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📅</span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">No appointments yet</p>
                        <p className="text-gray-500 text-sm">Appointments will appear here when patients book</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  Generate Report
                </h2>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Report Period Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Period</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['today', 'week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setReportRange(period)}
                      className={`px-4 py-3 rounded-xl border text-center transition-all ${
                        reportRange === period
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashData.earnings)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">{dashData.appointments}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Patients</p>
                        <p className="text-2xl font-bold text-gray-900">{dashData.patients}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointments Summary */}
                  <div className="border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <h4 className="font-medium text-gray-900">Appointments Summary</h4>
                    </div>
                    <div className="divide-y">
                      {dashData.latestAppointments.slice(0, 5).map((item: Appointment, index: number) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{item.userData.name}</p>
                              <p className="text-sm text-gray-500">
                                {slotDateFormat(item.slotDate)} • {item.slotTime}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item)}`}>
                              {getStatusText(item)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Format */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Format</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 text-xl">📄</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Professional PDF Report</p>
                        <p className="text-sm text-gray-500">Includes charts, tables, and analytics</p>
                      </div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">Selected</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => setShowReport(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDashboard