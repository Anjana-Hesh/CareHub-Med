// import { useContext, useEffect } from 'react';
// import { AdminContext, type AppointmentType as BaseAppointmentType } from '../../context/AdminContext';
// import { AppContext } from '../../context/AppContext';
// import { assets } from '../../assets/assetsAdmin';

// interface UserData {
//   _id: string;
//   name: string;
//   dob: string;
//   image: string;
// }

// interface DoctorData {
//   _id: string;
//   name: string;
//   image: string;
//   speciality?: string;
//   degree?: string;
// }

// interface Appointment extends BaseAppointmentType {
//   userData: UserData;
//   docData: DoctorData;
//   slotDate: string;
//   slotTime: string;
//   amount: number;
//   cancelled: boolean;
//   isCompleted: boolean;
// }

// const AllApointment: React.FC = () => {
//   const adminContext = useContext(AdminContext);
//   const appContext = useContext(AppContext);

//   if (!adminContext || !appContext) return <div>Context not available</div>;

//   const { aToken, appointments, getAllAppointments, cancelAppointment } = adminContext;
//   const { calculateAge, slotDateFormat, currency } = appContext;

//   useEffect(() => {
//     if (aToken) getAllAppointments();
//   }, [aToken]);

//   const typedAppointments = appointments as Appointment[];

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-5">
//         📋 All Appointments
//       </h2>

//       <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        
//         {/* Header */}
//         <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] py-4 px-6 bg-gray-50 border-b font-semibold text-gray-700 text-sm">
//           <p>#</p>
//           <p>Patient</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Doctor</p>
//           <p>Fees</p>
//           <p>Action</p>
//         </div>

//         {/* Content */}
//         <div className="max-h-[75vh] overflow-y-auto">
//           {typedAppointments.map((item, index) => (
//             <div
//               key={item._id}
//               className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center 
//                         px-6 py-4 border-b 
//                         hover:bg-gray-100 transition-all duration-200"
//             >
//               <p className="max-sm:hidden font-medium text-gray-600">{index + 1}</p>

//               {/* Patient */}
//               <div className="flex items-center gap-3">
//                 <img
//                   src={item.userData.image}
//                   className="w-10 h-10 rounded-full shadow"
//                   alt="User"
//                 />
//                 <div>
//                   <p className="font-medium">{item.userData.name}</p>
//                 </div>
//               </div>

//               {/* Age */}
//               <p className="max-sm:hidden font-medium text-gray-700">
//                 {calculateAge(item.userData.dob)}
//               </p>

//               {/* Date */}
//               <div className="text-gray-700">
//                 <p className="font-medium">{slotDateFormat(item.slotDate)}</p>
//                 <p className="text-sm text-gray-500">{item.slotTime}</p>
//               </div>

//               {/* Doctor */}
//               <div className="flex items-center gap-3">
//                 <img
//                   src={item.docData.image}
//                   className="w-10 h-10 rounded-full shadow bg-gray-300"
//                   alt="Doctor"
//                 />
//                 <div>
//                   <p className="font-medium">{item.docData.name}</p>
//                 </div>
//               </div>

//               {/* Fees */}
//               <p className="font-semibold text-gray-800">
//                 {currency} {item.amount}
//               </p>

//               {/* Action */}
//               <div>
//                 {item.cancelled ? (
//                   <span className="text-red-500 font-semibold text-sm">Cancelled</span>
//                 ) : item.isCompleted ? (
//                   <span className="text-green-600 font-semibold text-sm">Completed</span>
//                 ) : (
//                   <img
//                     onClick={() => cancelAppointment(item._id)}
//                     src={assets.cancel_icon}
//                     className="w-9 cursor-pointer hover:scale-110 transition-transform"
//                     alt="Cancel"
//                   />
//                 )}
//               </div>

//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllApointment;



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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            📋 All Appointments
          </h1>
          <p className="text-gray-600 mt-2">Manage and view all scheduled appointments</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Fees</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.userData.image}
                            alt={item.userData.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.userData.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateAge(item.userData.dob)} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-sm font-medium text-gray-900">
                        {slotDateFormat(item.slotDate)}
                      </div>
                      <div className="text-sm text-gray-500">{item.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.docData.image}
                            alt={item.docData.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.docData.name}
                          </div>
                          {item.docData.speciality && (
                            <div className="text-sm text-gray-500">{item.docData.speciality}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currency} {item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.cancelled ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex items-center text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          <img
                            src={assets.cancel_icon}
                            className="w-5 h-5 mr-1 cursor-pointer hover:scale-110 transition-transform"
                            alt="Cancel"
                          />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointments found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, typedAppointments.length)}</span> of{' '}
              <span className="font-medium">{typedAppointments.length}</span> appointments
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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