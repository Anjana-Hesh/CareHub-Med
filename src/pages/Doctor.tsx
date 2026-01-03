import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  image: string;
  available: boolean;
}

interface AppContextType {
  doctors: Doctor[];
}

const Doctor: React.FC = () => {
  const { speciality } = useParams<{ speciality?: string }>();
  const { doctors } = useContext(AppContext) as AppContextType;

  const [filterDoc, setFilterDoc] = useState<Doctor[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const specialities = [
    { name: 'General physician', icon: '🩺' },
    { name: 'Gynecologist', icon: '👩' },
    { name: 'Dermatologist', icon: '✨' },
    { name: 'Pediatricians', icon: '👶' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Gastroenterologist', icon: '🫀' },
    { name: 'Cardiologist', icon: '❤️' },
    { name: 'Orthopedist', icon: '🦴' },
    { name: 'Psychiatrist', icon: '🧩' },
    { name: 'Ophthalmologist', icon: '👁️' },
    { name: 'ENT Specialist', icon: '👂' },
    { name: 'Dentist', icon: '😁' },
    { name: 'Nephrologist', icon: '🩸' },
    { name: 'Oncologist', icon: '🎗️' },
    { name: 'Endocrinologist', icon: '🧬' },
    { name: 'Pulmonologist', icon: '🫁' },
    { name: 'Rheumatologist', icon: '🦠' }
  ];


  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 py-12 px-4'>
      
      <div className='max-w-7xl mx-auto mb-8'>
        <h1 className='text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3'>
          Find Your Doctor
        </h1>
        <p className='text-gray-600'>Browse through our qualified doctors by specialty</p>
      </div>

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8'>
        
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className='lg:hidden bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
          </svg>
          Filter by Specialty
        </button>

        <div className={`${showFilter ? 'flex' : 'hidden'} lg:flex flex-col gap-3 lg:w-64 shrink-0`}>
          <div className='bg-white rounded-xl shadow-lg p-4'>
            <h3 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
              </svg>
              Specialties
            </h3>
            <div className='space-y-2'>
              {specialities.map(spec => (
                <button
                  key={spec.name}
                  onClick={() => speciality === spec.name ? navigate('/doctors') : navigate(`/doctors/${spec.name}`)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    speciality === spec.name 
                      ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className='text-xl'>{spec.icon}</span>
                  <span className='font-medium'>{spec.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='flex-1'>
          {filterDoc.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filterDoc.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className='group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500'
                >
                  <div className='relative overflow-hidden'>
                    <img 
                      className='w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300' 
                      src={item.image} 
                      alt={item.name} 
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      item.available 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      <span className='w-2 h-2 bg-white rounded-full animate-pulse' />
                      {item.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div className='p-5'>
                    <h3 className='text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors'>
                      {item.name}
                    </h3>
                    <p className='text-gray-600 text-sm mb-3'>{item.speciality}</p>
                    
                    <button className='w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
              <svg className='w-24 h-24 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>No Doctors Found</h3>
              <p className='text-gray-600'>
                {speciality 
                  ? `No doctors available for ${speciality}` 
                  : 'No doctors available at the moment'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;