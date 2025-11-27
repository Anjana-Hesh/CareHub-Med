import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const {doctors , aToken , getAllDoctors , changeAvailability} = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  } , [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item , index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500' src={item.image} alt="Doc Image" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList




// import React, { useContext, useEffect } from 'react';
// import { AdminContext } from '../../context/AdminContext';

// const DoctorsList = () => {
//   const { doctors, aToken, getAllDoctors } = useContext(AdminContext);

//   useEffect(() => {
//     if (aToken) {
//       getAllDoctors();
//     }
//   }, [aToken, getAllDoctors]);

//   if (!doctors || doctors.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
//         <div className="max-w-6xl mx-auto px-4">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Doctors</h1>
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400 mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                 />
//               </svg>
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h2>
//               <p className="text-gray-600 mb-4">There are no doctors available at the moment.</p>
//               <button
//                 onClick={getAllDoctors}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Refresh List
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Doctors</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {doctors.map((item, index) => (
//             <div
//               key={item.id || index}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//             >
//               <img
//                 src={item.image || '/placeholder-doctor.jpg'} // Fallback image
//                 alt={`${item.name}'s image`}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
//                 <p className="text-blue-600 font-medium mb-4">{item.speciality}</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">View Profile</span>
//                   <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors">
//                     Contact
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorsList;