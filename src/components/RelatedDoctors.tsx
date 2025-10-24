// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import { useNavigate } from 'react-router-dom'

// const RelatedDoctors = ({speciality , docId}) => {

//     const { doctors } = useContext(AppContext)
//     const navigate = useNavigate()

//     const [relDoc , setRelDoc] = useState([])

//     useEffect(() => {
//         if (doctors.length > 0 && speciality) {
//             const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
//             setRelDoc(doctorsData)
//         }
//     } , [doctors , speciality , docId])

//     return (
//         <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
//             <h1 className='text-3xl font-medium'>Related Doctors</h1>
//             <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
//             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//                 {relDoc.slice(0,5).map((item , index)=>(
//                     <div onClick={()=> {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
//                         <img className='bg-blue-50' src={item.image} alt="doctors" />
//                         <div className='p-4'>
//                             <div className='flex items-center gap-2 text-sm text-center text-green-500'>
//                                 <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
//                             </div>
//                             <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
//                             <p className='text-gray-600 text-sm'>{item.speciality}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//                 <button onClick={()=>{ navigate('/doctors'); scrollTo(0,0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more ...</button>
//         </div>
//     )
// }

// export default RelatedDoctors

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// --- TypeScript Interfaces (for better component definition) ---
// Define the structure of the Doctor object (based on previous context)
interface Doctor {
    _id: string;
    name: string;
    speciality: string;
    image: string;
    // ... add other necessary fields if needed
}

// Define the expected structure of the AppContext
interface AppContextType {
    doctors: Doctor[];
    // ... add other context values
}

// Define the props for the RelatedDoctors component
interface RelatedDoctorsProps {
    speciality: string | undefined;
    docId: string | undefined;
}
// -----------------------------------------------------------------

const RelatedDoctors: React.FC<RelatedDoctorsProps> = ({ speciality, docId }) => {

    // Use type assertion for context
    const { doctors } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    // State to hold the filtered list of related doctors
    const [relDoc, setRelDoc] = useState<Doctor[]>([]);

    // Effect to filter related doctors whenever dependencies change
    useEffect(() => {
        // Ensure doctors array exists and we have both specialty and docId
        if (doctors.length > 0 && speciality && docId) {
            // Filter logic: Match specialty AND exclude the current doctor's ID
            const doctorsData = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            );
            setRelDoc(doctorsData);
        } else {
            // Clear the list if essential props are missing
            setRelDoc([]);
        }
    }, [doctors, speciality, docId]);

    // Render nothing if no related doctors are found
    if (relDoc.length === 0) {
        return null;
    }

    // Function to handle navigation and scroll to top
    const handleNavigation = (id: string | null = null) => {
        if (id) {
            navigate(`/appointment/${id}`);
        } else {
            navigate('/doctors');
        }
        // Ensure the new page starts at the top
        window.scrollTo(0, 0); 
    };

    return (
        // The main container provides padding and centered layout
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-bold'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-base text-gray-600'>
                Browse through other trusted specialists in {speciality}.
            </p>

            {/* Grid for Doctor Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {/* Display up to 5 related doctors */}
                {relDoc.slice(0, 5).map((item, index) => (
                    <div 
                        onClick={() => handleNavigation(item._id)} 
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 shadow-sm hover:shadow-lg' 
                        key={index} // Use item._id for a stable key
                    >
                        <img className='bg-blue-50 w-full h-auto object-cover' src={item.image} alt={`Dr. ${item.name}`} />
                        <div className='p-4'>
                            {/* Availability status */}
                            <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                <p>Available</p>
                            </div>
                            {/* Name and Specialty */}
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 'More' Button to navigate to the general doctors page */}
            <button 
                onClick={() => handleNavigation(null)} 
                className='bg-indigo-500 text-white px-12 py-3 rounded-full mt-10 font-semibold hover:bg-indigo-600 transition-colors'
            >
                View All Specialists
            </button>
        </div>
    );
};

export default RelatedDoctors;