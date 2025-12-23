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
      <div className='flex items-center justify-center min-h-screen ml-100'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-[#5f6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-4 sm:p-6 lg:p-10 ml-70">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time overview of platform performance
        </p>
      </div>

      <button
        onClick={() => setShowReport(true)}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition"
      >
        📄 Generate Report
      </button>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-6 hover:-translate-y-2 transition"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full" />

          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <img src={stat.icon} className="w-8 h-8" />
            </div>

            <div>
              <p className="text-4xl font-black text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* APPOINTMENTS */}
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/30">
      <div className="flex justify-between items-center px-8 py-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          Recent Appointments
        </h2>
        <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600">
          {dashData.latestAppointments.length} records
        </span>
      </div>

      {dashData.latestAppointments.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          No appointments yet
        </div>
      ) : (
        <div className="divide-y">
          {dashData.latestAppointments.map(item => (
            <div
              key={item._id}
              className="flex items-center gap-5 px-8 py-5 hover:bg-gray-50 transition"
            >
              <img
                src={item.docData.image}
                className="w-14 h-14 rounded-2xl object-cover shadow"
              />

              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  Dr. {item.docData.name}
                </p>
                <p className="text-sm text-gray-500">
                  {slotDateFormat(item.slotDate)} • {item.slotTime}
                </p>
              </div>

              <div className="text-right hidden sm:block">
                <p className="font-black text-gray-900">
                  {currency}{item.amount}
                </p>
                <p className="text-[10px] text-gray-400 uppercase">
                  Consultation
                </p>
              </div>

              <div>
                {item.cancelled ? (
                  <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-600">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-600">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleCancelAppointment(item._id)}
                    className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition"
                  >
                    <img src={assets.cancel_icon} className="w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* REPORT MODAL */}
    {showReport && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl animate-in zoom-in">
          <h3 className="text-2xl font-black mb-2 text-gray-900">
            Export Dashboard Report
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Generate a professional PDF summary
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowReport(false)}
              className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={downloadPDF}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default Dashboard;