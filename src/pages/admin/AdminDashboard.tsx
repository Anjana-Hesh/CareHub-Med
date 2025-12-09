// import { useContext, useEffect } from 'react';
// import { AdminContext } from '../../context/AdminContext';
// import { AppContext } from '../../context/AppContext';
// import { assets } from '../../assets/assetsAdmin';

// interface DoctorData {
//   _id: string;
//   name: string;
//   image: string;
//   speciality: string;
//   degree: string;
//   experience: string;
//   about: string;
//   fees: number;
//   address: {
//     line1: string;
//     line2: string;
//   };
// }

// interface Appointment {
//   _id: string;
//   userId: string;
//   docId: string;
//   slotDate: string;
//   slotTime: string;
//   docData: DoctorData;
//   amount: number;
//   date: number;
//   cancelled: boolean;
//   payment: boolean;
//   isCompleted: boolean;
// }

// interface ActualDashDataType {
//   doctors: number;
//   appointments: number;
//   patients: number;
//   latestAppointments: Appointment[];
// }

// interface StatCard {
//   icon: string;
//   value: number;
//   label: string;
//   color: string;
// }

// const Dashboard: React.FC = () => {
//   const adminContext = useContext(AdminContext);
//   const appContext = useContext(AppContext);

//   if (!adminContext || !appContext) {
//     return <div>Context not available</div>;
//   }

//   const { aToken, getDashData, cancelAppointment, dashData } = adminContext;
//   const { slotDateFormat } = appContext;

//   useEffect(() => {
//     if (aToken) {
//       getDashData();
//     }
//   }, [aToken, getDashData]);

//   const isValidDashData = (data: any): data is ActualDashDataType => {
//     return data && typeof data === 'object' && 'doctors' in data && 'appointments' in data;
//   };

//   if (!dashData || !isValidDashData(dashData)) {
//     return (
//       <div className='flex items-center justify-center min-h-screen'>
//         <div className='text-center'>
//           <div className='w-16 h-16 border-4 border-[#5f6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
//           <p className='text-gray-600'>Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const stats: StatCard[] = [
//     {
//       icon: assets.doctor_icon,
//       value: dashData.doctors,
//       label: 'Doctors',
//       color: 'text-blue-600'
//     },
//     {
//       icon: assets.appointment_icon,
//       value: dashData.appointments,
//       label: 'Appointments',
//       color: 'text-green-600'
//     },
//     {
//       icon: assets.patients_icon,
//       value: dashData.patients,
//       label: 'Patients',
//       color: 'text-purple-600'
//     }
//   ];

//   const handleCancelAppointment = (appointmentId: string): void => {
//     cancelAppointment(appointmentId);
//   };

//   return (
//     <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8'>
//         {stats.map((stat: StatCard, index: number) => (
//           <div
//             key={index}
//             className='flex items-center gap-4 bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer'
//           >
//             <div className='p-3 bg-gray-50 rounded-lg'>
//               <img className='w-10 h-10 lg:w-12 lg:h-12' src={stat.icon} alt={stat.label} />
//             </div>
//             <div>
//               <p className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
//               <p className='text-gray-500 text-sm lg:text-base mt-1'>{stat.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        
//         <div className='flex items-center gap-3 px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200'>
//           <div className='p-2 bg-[#5f6FFF] rounded-lg'>
//             <img className='w-5 h-5' src={assets.list_icon} alt="List" />
//           </div>
//           <div className='flex-1'>
//             <p className='font-semibold text-gray-800 text-base lg:text-lg'>Latest Bookings</p>
//             <p className='text-xs text-gray-500 mt-0.5'>Recent appointment requests</p>
//           </div>
//           <span className='bg-[#5f6FFF] text-white text-xs px-3 py-1 rounded-full font-medium'>
//             {dashData.latestAppointments.length}
//           </span>
//         </div>

//         <div className='divide-y divide-gray-100'>
//           {dashData.latestAppointments.length === 0 ? (
//             <div className='text-center py-12'>
//               <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
//                 <img className='w-8 h-8 opacity-50' src={assets.appointment_icon} alt="No appointments" />
//               </div>
//               <p className='text-gray-500 text-sm'>No appointments yet</p>
//             </div>
//           ) : (
//             dashData.latestAppointments.map((item: Appointment) => (
//               <div
//                 key={item._id}
//                 className='flex items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4 hover:bg-gray-50 transition-colors'
//               >
//                 <img
//                   className='rounded-full w-12 h-12 sm:w-14 sm:h-14 object-cover border-2 border-gray-200'
//                   src={item.docData.image}
//                   alt={item.docData.name}
//                 />

//                 <div className='flex-1 min-w-0'>
//                   <p className='text-gray-800 font-semibold text-sm sm:text-base truncate'>
//                     {item.docData.name}
//                   </p>
//                   <p className='text-gray-500 text-xs sm:text-sm mt-1'>
//                     {slotDateFormat(item.slotDate)}
//                   </p>
//                 </div>

//                 <div className='flex-shrink-0'>
//                   {item.cancelled ? (
//                     <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200'>
//                       Cancelled
//                     </span>
//                   ) : item.isCompleted ? (
//                     <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200'>
//                       Completed
//                     </span>
//                   ) : (
//                     <button
//                       onClick={() => handleCancelAppointment(item._id)}
//                       className='p-2 hover:bg-red-50 rounded-lg transition-colors group'
//                       title='Cancel appointment'
//                       aria-label={`Cancel appointment with ${item.docData.name}`}
//                     >
//                       <img
//                         className='w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform'
//                         src={assets.cancel_icon}
//                         alt="Cancel"
//                       />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import { useContext, useEffect, useMemo, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assetsAdmin';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

interface DoctorData {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
}

interface Appointment {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  docData: DoctorData;
  amount: number;
  date: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
}

interface ActualDashDataType {
  doctors: number;
  appointments: number;
  patients: number;
  latestAppointments: Appointment[];
}

interface StatCard {
  icon: string;
  value: number;
  label: string;
  color: string;
  bg: string;
}

interface JsPDFWithAutoTable extends jsPDF {
  autoTable: ((options: any) => void) & {
    previous: { finalY: number };
  };
}


const Dashboard: React.FC = () => {
  const adminContext = useContext(AdminContext);
  const appContext = useContext(AppContext);

  const ADMIN_PRIMARY_COLOR = 'rgb(95, 111, 255)'; 

  if (!adminContext || !appContext) {
    return <div>Context not available</div>;
  }

  const { aToken, getDashData, cancelAppointment, dashData } = adminContext;
  const { slotDateFormat, currency } = appContext;
  
  const [showReport, setShowReport] = useState<boolean>(false)


  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  const isValidDashData = (data: any): data is ActualDashDataType => {
    return data && typeof data === 'object' && 'doctors' in data && 'appointments' in data;
  };

  const handleCancelAppointment = (appointmentId: string): void => {
    cancelAppointment(appointmentId);
  };
  
  const stats: StatCard[] = useMemo(() => ([
    {
      icon: assets.doctor_icon,
      value: dashData && isValidDashData(dashData) ? dashData.doctors : 0,
      label: 'Total Doctors',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: assets.appointment_icon,
      value: dashData && isValidDashData(dashData) ? dashData.appointments : 0,
      label: 'Total Appointments',
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: assets.patients_icon,
      value: dashData && isValidDashData(dashData) ? dashData.patients : 0,
      label: 'Total Patients',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ]), [dashData]);

  const downloadPDF = () => {
    if (!dashData || !isValidDashData(dashData)) return;

    // Use the extended PDF type
    const doc = new jsPDF() as JsPDFWithAutoTable;
    const now = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const primaryColorRGB = [95, 111, 255]; 

    // --- Header ---
    doc.setFontSize(26);
    doc.setTextColor(primaryColorRGB[0], primaryColorRGB[1], primaryColorRGB[2]);
    doc.text("Admin Dashboard Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${now}`, 14, 27);
    
    // --- Key Metrics Overview ---
    let currentY = 40;
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("Key Metrics Overview", 14, currentY);
    
    const metricsData = [
      ['Total Doctors', dashData.doctors],
      ['Total Appointments', dashData.appointments],
      ['Total Patients', dashData.patients],
    ];

    doc.autoTable({
      startY: currentY + 5,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: primaryColorRGB, textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
    
    currentY = doc.autoTable.previous.finalY + 15;

    // --- Latest Appointments Section ---
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text("Latest Appointments Details", 14, currentY);
    
    currentY += 5;

    const appointmentRows = dashData.latestAppointments.map((item, index) => {
      let statusText;
      let statusColor = [0, 0, 0];
      
      if (item.cancelled) {
        statusText = "Cancelled";
        statusColor = [255, 0, 0];
      } else if (item.isCompleted) {
        statusText = "Completed";
        statusColor = [0, 128, 0];
      } else {
        statusText = "Pending";
        statusColor = [255, 165, 0];
      }
      
      const dateString = `${slotDateFormat(item.slotDate)} ${item.slotTime}`;
      const amountString = `${currency}${item.amount}`;

      return [
        index + 1,
        item.docData.name,
        dateString,
        amountString,
        { content: statusText, styles: { textColor: statusColor } }
      ];
    });
    
    doc.autoTable({
      startY: currentY,
      head: [['#', 'Doctor', 'Date & Time', 'Amount', 'Status']],
      body: appointmentRows,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: primaryColorRGB, textColor: [255, 255, 255] },
      columnStyles: {
        4: { cellWidth: 20 }, 
      },
      margin: { left: 14, right: 14 }
    });
    
    // --- Footer ---
    currentY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("- End of Report -", doc.internal.pageSize.width / 2, currentY, { align: 'center' });

    doc.save("admin_dashboard_report.pdf");
  };


  if (!dashData || !isValidDashData(dashData)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-[#5f6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>📊 Admin Overview</h1>

      {/* Report Generation Button */}
      <div className='mb-8 flex justify-end'>
        <button
          onClick={() => setShowReport(true)}
          className='bg-[#5f6FFF] text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center gap-2 font-medium transform hover:scale-[1.02]'
        >
          <img src={assets.list_icon} alt="Report" className='w-5 invert' />
          Generate Report
        </button>
      </div>
      
      {/* Stat Cards Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
        {stats.map((stat: StatCard, index: number) => (
          <div
            key={index}
            className='flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl transform hover:scale-[1.01] transition-all duration-300 cursor-pointer'
          >
            <div className={`p-4 ${stat.bg} rounded-xl`}>
              <img className='w-10 h-10' src={stat.icon} alt={stat.label} />
            </div>
            <div>
              <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className='text-gray-500 text-sm mt-1'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden'>
        
        <div className='flex items-center gap-3 px-4 sm:px-6 py-4 bg-indigo-50 border-b border-gray-200'>
          <div className='p-2 bg-[#5f6FFF] rounded-lg'>
            <img className='w-5 h-5 invert' src={assets.list_icon} alt="List" />
          </div>
          <div className='flex-1'>
            <p className='font-bold text-gray-800 text-lg'>Latest Appointments</p>
            <p className='text-xs text-gray-600'>Management of recent appointment requests</p>
          </div>
          <span className='bg-[#5f6FFF] text-white text-xs px-3 py-1 rounded-full font-medium shadow-md'>
            {dashData.latestAppointments.length} Bookings
          </span>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img className='w-8 h-8 opacity-50' src={assets.appointment_icon} alt="No appointments" />
              </div>
              <p className='text-gray-500 text-sm'>No appointments yet. The platform is waiting for its first booking!</p>
            </div>
          ) : (
            dashData.latestAppointments.map((item: Appointment) => (
              <div
                key={item._id}
                className='flex items-center px-4 sm:px-6 py-4 gap-4 hover:bg-gray-50 transition-colors'
              >
                <img
                  className='rounded-full w-14 h-14 object-cover border-2 border-indigo-200 shadow-md'
                  src={item.docData.image}
                  alt={item.docData.name}
                />

                <div className='flex-1 min-w-0'>
                  <p className='text-gray-900 font-semibold text-base truncate'>
                    Dr. {item.docData.name}
                  </p>
                  <p className='text-gray-500 text-sm mt-0.5'>
                    <span className='font-medium text-indigo-500'>Date:</span> {slotDateFormat(item.slotDate)} at {item.slotTime}
                  </p>
                  <p className='text-gray-500 text-xs'>
                    {currency}{item.amount} fee paid
                  </p>
                </div>

                {/* Status Badge & Action */}
                <div className='flex-shrink-0'>
                  {item.cancelled ? (
                    <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700'>
                      <span className="text-sm mr-1">❌</span> Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700'>
                      <span className="text-sm mr-1">✅</span> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCancelAppointment(item._id)}
                      className='p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group shadow-sm border border-red-200'
                      title='Cancel appointment'
                      aria-label={`Cancel appointment with ${item.docData.name}`}
                    >
                      <img
                        className='w-6 h-6 text-red-500 group-hover:scale-110 transition-transform'
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Report Preview Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto p-8 transform transition-all duration-300 scale-100">
            <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 border-b pb-3 flex items-center gap-3">
              <span className='text-4xl'>📑</span> Admin Report Preview
            </h2>

            {/* Overview Cards */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={`p-4 ${stat.bg} rounded-xl border border-gray-200 shadow-sm`}>
                  <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Appointments List Preview */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Latest Appointments ({dashData.latestAppointments.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {dashData.latestAppointments.length > 0 ? (
                  dashData.latestAppointments.map((item: Appointment, i: number) => (
                    <div key={i} className="p-3 bg-white rounded-xl border-l-4 border-indigo-400 shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">Dr. {item.docData.name}</p>
                        <p className="text-sm text-gray-500">Date: {slotDateFormat(item.slotDate)} | {currency}{item.amount}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.cancelled ? 'bg-red-100 text-red-700' : item.isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-6">No appointments to display in this report.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowReport(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Close
              </button>
              <button
                onClick={downloadPDF}
                className="px-6 py-2 bg-[#5f6FFF] text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200 font-medium flex items-center gap-2"
              >
                <span className="text-lg">⬇️</span> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;