import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Assuming AppContext is here

// This is crucial for fixing the 'not assignable to never[]' error.
interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  image: string;
}

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

    const[showFilter , setShowFilter] = useState(false)

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
               
               <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6FFF] text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
               
                {/* Specialty Filter Section */}
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
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