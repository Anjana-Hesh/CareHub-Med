// import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'

// const Doctor = () => {

//   const {speciality} = useParams() // get specialist as a prameter
//   console.log(speciality)

//   const [filterDoc , setFilterDoc] = useState([])   // to filter the doctors when click the buttn
//   const navigate = useNavigate()

//   const {doctors} = useContext(AppContext)

//   const applyFilter = () => {
//     if (speciality) {
//       setFilterDoc(doctors.filter(doc => doc.speciality == speciality))
//     } else {
//       setFilterDoc(doctors)
//     }
//   }

//   useEffect (() => {
//     applyFilter()
//   }, [doctors,speciality])

//     return (
//       <div>
//           <p className='text-gray-600'>Browse through the doctors specialitist.</p>
//           <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
//             <div className='flex flex-col gap-4 text-sm text-gray-600'>
//               <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
//               <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
//               <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
//               <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
//               <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
//               <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
//             </div>
//           <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
//             {
//               filterDoc.map((item , index)=>(
//                     <div onClick={()=> navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
//                         <img className='bg-blue-50' src={item.image} alt="doctors" />
//                         <div className='p-4'>
//                             <div className='flex items-center gap-2 text-sm text-center text-green-500'>
//                                 <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
//                             </div>
//                             <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
//                             <p className='text-gray-600 text-sm'>{item.speciality}</p>
//                         </div>
//                     </div>
//                 ))
//             }
//           </div>
//       </div>
//     </div>
//     )
// }

// export default Doctor



import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Assuming AppContext is here

// 1. Define the TypeScript Interface for a Doctor
// This is crucial for fixing the 'not assignable to never[]' error.
interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  image: string;
  // Add any other properties your doctor object contains
}

// 2. Define the TypeScript Interface for the Context Value
// This ensures 'doctors' is correctly typed when accessed from context.
interface AppContextType {
    doctors: Doctor[];
    // Include any other context values here (e.g., user, isLoading)
}

const Doctor: React.FC = () => {
    // Get specialist as a parameter from the URL (e.g., /doctors/Gynecologist)
    const { speciality } = useParams<{ speciality: string }>(); 
    console.log(speciality);

    // FIX: Explicitly set the type of the state to Doctor[]
    const [filterDoc, setFilterDoc] = useState<Doctor[]>([]); 
    const navigate = useNavigate();

    // Use type assertion to ensure TypeScript knows the structure of the context
    const { doctors } = useContext(AppContext) as AppContextType;

    const applyFilter = () => {
        if (speciality) {
            // Filter the doctors based on the URL parameter
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality)); // Using strict equality (===)
        } else {
            // Show all doctors if no specialty is specified
            setFilterDoc(doctors);
        }
    };

    // Recalculate the filter whenever the list of doctors or the specialty parameter changes
    useEffect(() => {
        applyFilter();
    }, [doctors, speciality]);

    return (
        <div>
            <p className='text-gray-600'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* Specialty Filter Section */}
                <div className='flex flex-col gap-4 text-sm text-gray-600'>
                    {/* Filter Links */}
                    {[
                        'General physician', 'Gynecologist', 'Dermatologist', 
                        'Pediatricians', 'Neurologist', 'Gastroenterologist'
                    ].map((spec) => (
                        <p 
                            key={spec}
                            onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? "bg-indigo-100 text-black font-medium" : ""}`}
                        >
                            {spec}
                        </p>
                    ))}
                </div>

                {/* Doctor List Section */}
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterDoc.length > 0 ? (
                        filterDoc.map((item, index) => (
                            <div 
                                onClick={() => navigate(`/appointment/${item._id}`)} 
                                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
                                key={item._id || index} // Use _id as key if available
                            >
                                <img className='bg-blue-50 w-full h-auto object-cover' src={item.image} alt={item.name} />
                                <div className='p-4'>
                                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                        <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                    </div>
                                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 col-span-full'>
                            {speciality ? `No doctors found for: ${speciality}` : "No doctors available."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Doctor;