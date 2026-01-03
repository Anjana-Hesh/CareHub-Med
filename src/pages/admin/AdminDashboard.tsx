import { useContext, useEffect, useMemo, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assetsAdmin';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

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

  if (!adminContext || !appContext) {
    return <div>Context not available</div>;
  }

  const { aToken, getDashData, cancelAppointment, dashData } = adminContext;
  const { slotDateFormat, currency } = appContext;

  const [showReport, setShowReport] = useState<boolean>(false);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const isValidDashData = (data: any): data is ActualDashDataType => {
    return data && typeof data === 'object' && 'doctors' in data && 'appointments' in data;
  };

  const handleCancelAppointment = async (appointmentId: string): Promise<void> => {
    const result = await Swal.fire({
      title: 'Cancel Appointment?',
      text: 'This appointment will be cancelled permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#5f6FFF',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    cancelAppointment(appointmentId);
  };

  const stats: StatCard[] = useMemo(
    () => [
      {
        icon: assets.doctor_icon,
        value: dashData && isValidDashData(dashData) ? dashData.doctors : 0,
        label: 'Total Doctors',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
      },
      {
        icon: assets.appointment_icon,
        value: dashData && isValidDashData(dashData) ? dashData.appointments : 0,
        label: 'Total Appointments',
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      {
        icon: assets.patients_icon,
        value: dashData && isValidDashData(dashData) ? dashData.patients : 0,
        label: 'Total Patients',
        color: 'text-purple-600',
        bg: 'bg-purple-100',
      },
    ],
    [dashData]
  );

  const downloadPDF = () => {
    if (!dashData || !isValidDashData(dashData)) return;

    const doc = new jsPDF() as JsPDFWithAutoTable;
    const now = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const primaryColorRGB = [95, 111, 255];

    doc.setFontSize(26);
    doc.setTextColor(primaryColorRGB[0], primaryColorRGB[1], primaryColorRGB[2]);
    doc.text('Admin Dashboard Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${now}`, 14, 27);

    let currentY = 40;
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text('Key Metrics Overview', 14, currentY);

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
      margin: { left: 14, right: 14 },
    });

    currentY = doc.autoTable.previous.finalY + 15;

    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text('Latest Appointments Details', 14, currentY);

    currentY += 5;

    const appointmentRows = dashData.latestAppointments.map((item, index) => {
      let statusText;
      let statusColor = [0, 0, 0];

      if (item.cancelled) {
        statusText = 'Cancelled';
        statusColor = [255, 0, 0];
      } else if (item.isCompleted) {
        statusText = 'Completed';
        statusColor = [0, 128, 0];
      } else {
        statusText = 'Pending';
        statusColor = [255, 165, 0];
      }

      const dateString = `${slotDateFormat(item.slotDate)} ${item.slotTime}`;
      const amountString = `${currency}${item.amount}`;

      return [
        index + 1,
        item.docData.name,
        dateString,
        amountString,
        { content: statusText, styles: { textColor: statusColor } },
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
      margin: { left: 14, right: 14 },
    });

    currentY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('- End of Report -', doc.internal.pageSize.width / 2, currentY, { align: 'center' });

    doc.save('admin_dashboard_report.pdf');
  };

  if (!dashData || !isValidDashData(dashData)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5f6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen 
        bg-linear-to-br from-indigo-50 via-blue-50 to-white 
        pb-12 pt-4 lg:pt-0
        lg:ml-64
      "
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 ml-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time overview of platform performance
            </p>
          </div>

          <button
            onClick={() => setShowReport(true)}
            className="px-6 py-3 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition"
          >
            📄 Generate Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl p-6 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl" />

              <div className="flex items-center gap-5 relative z-10">
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <img src={stat.icon} className="w-8 h-8" alt={stat.label} />
                </div>

                <div>
                  <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT APPOINTMENTS */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 sm:px-8 py-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600">
              {dashData.latestAppointments.length} records
            </span>
          </div>

          {dashData.latestAppointments.length === 0 ? (
            <div className="py-20 text-center text-gray-400">No appointments yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dashData.latestAppointments.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 sm:px-8 py-5 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={item.docData.image}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                    alt={item.docData.name}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">Dr. {item.docData.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {slotDateFormat(item.slotDate)} • {item.slotTime}
                    </p>
                  </div>

                  <div className="text-right sm:min-w-[120px]">
                    <p className="font-black text-gray-900">
                      {currency}{item.amount}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase mt-0.5">Consultation</p>
                  </div>

                  <div className="w-full sm:w-auto">
                    {item.cancelled ? (
                      <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-600 block text-center sm:inline-block">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-600 block text-center sm:inline-block">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCancelAppointment(item._id)}
                        className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition w-full sm:w-auto flex justify-center"
                      >
                        <img src={assets.cancel_icon} className="w-5" alt="Cancel" />
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in">
              <h3 className="text-2xl font-black mb-2 text-gray-900">Export Dashboard Report</h3>
              <p className="text-sm text-gray-500 mb-6">Generate a professional PDF summary</p>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowReport(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;