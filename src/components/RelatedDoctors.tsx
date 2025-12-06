import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface Doctor {
    _id: string;
    name: string;
    speciality: string;
    image: string;
    available?: boolean;
}

interface AppContextType {
    doctors: Doctor[];
}

interface RelatedDoctorsProps {
    speciality: string | undefined;
    docId: string | undefined;
}

const RelatedDoctors: React.FC<RelatedDoctorsProps> = ({ speciality, docId }) => {

    const { doctors } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    const [relDoc, setRelDoc] = useState<Doctor[]>([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality && docId) {
            const doctorsData = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            );
            setRelDoc(doctorsData);
        } else {
            setRelDoc([]);
        }
    }, [doctors, speciality, docId]);

    if (relDoc.length === 0) {
        return null;
    }

    const handleNavigation = (id: string | null = null) => {
        if (id) {
            navigate(`/appointment/${id}`);
        } else {
            navigate('/doctors');
        }
        window.scrollTo(0, 0); 
    };

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-bold'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-base text-gray-600'>
                Browse through other trusted specialists in {speciality}.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {relDoc.slice(0, 5).map((item, index) => (
                    <div 
                        onClick={() => handleNavigation(item._id)} 
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 shadow-sm hover:shadow-lg' 
                        key={index}
                    >
                        <img className='bg-blue-50 w-full h-auto object-cover' src={item.image} alt={`Dr. ${item.name}`} />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            
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