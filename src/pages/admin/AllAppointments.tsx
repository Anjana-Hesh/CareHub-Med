import { useContext, useEffect, useState } from 'react';
import { AdminContext, type AppointmentType as BaseAppointmentType } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assetsAdmin';

interface UserData {
  _id: string;
  name: string;
  dob: string;
  image: string;
}

interface DoctorData {
  _id: string;
  name: string;
  image: string;
  speciality?: string;
  degree?: string;
}

interface Appointment extends BaseAppointmentType {
  userData: UserData;
  docData: DoctorData;
  slotDate: string;
  slotTime: string;
  amount: number;
  cancelled: boolean;
  isCompleted: boolean;
}

const AllAppointment: React.FC = () => {
  const adminContext = useContext(AdminContext);
  const appContext = useContext(AppContext);

  if (!adminContext || !appContext) return <div>Context not available</div>;

  const { aToken, appointments, getAllAppointments, cancelAppointment } = adminContext;
  const { calculateAge, slotDateFormat, currency } = appContext;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  const typedAppointments = appointments as Appointment[];
  const totalPages = Math.ceil(typedAppointments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAppointments = typedAppointments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrev = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  return (
    <div
      className="
        min-h-screen
        bg-linear-to-br from-indigo-50 via-blue-50 to-white
        pb-12
        pt-4 lg:pt-0
        lg:ml-64
      "
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 ml-20">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              All Appointments
            </h1>
            <p className="text-gray-500 mt-1">
              Complete overview of patient bookings
            </p>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              Appointment Records
            </h2>
            <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600">
              {typedAppointments.length} Total
            </span>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="px-4 sm:px-6 py-4">#</th>
                  <th className="px-4 sm:px-6 py-4">Patient</th>
                  <th className="px-4 sm:px-6 py-4">Age</th>
                  <th className="px-4 sm:px-6 py-4">Date & Time</th>
                  <th className="px-4 sm:px-6 py-4">Doctor</th>
                  <th className="px-4 sm:px-6 py-4">Fees</th>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {currentAppointments.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-800">
                      {startIndex + index + 1}
                    </td>

                    {/* PATIENT */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.userData.image}
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                          alt={item.userData.name}
                        />
                        <p className="font-semibold text-gray-900">
                          {item.userData.name}
                        </p>
                      </div>
                    </td>

                    {/* AGE */}
                    <td className="px-4 sm:px-6 py-4 text-gray-600">
                      {calculateAge(item.userData.dob)} yrs
                    </td>

                    {/* DATE & TIME */}
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {slotDateFormat(item.slotDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.slotTime}
                      </p>
                    </td>

                    {/* DOCTOR */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.docData.image}
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                          alt={item.docData.name}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Dr. {item.docData.name}
                          </p>
                          {item.docData.speciality && (
                            <p className="text-xs text-gray-500">
                              {item.docData.speciality}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* FEES */}
                    <td className="px-4 sm:px-6 py-4 font-bold text-gray-900">
                      {currency}{item.amount.toLocaleString()}
                    </td>

                    {/* STATUS / ACTION */}
                    <td className="px-4 sm:px-6 py-4">
                      {item.cancelled ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition"
                        >
                          <img src={assets.cancel_icon} className="w-4 h-4" alt="Cancel" />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {currentAppointments.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              No appointments found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}</strong>–
              <strong>{Math.min(endIndex, typedAppointments.length)}</strong> of{' '}
              <strong>{typedAppointments.length}</strong>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white shadow border disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white border hover:bg-gray-50'
                  } transition`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white shadow border disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointment;