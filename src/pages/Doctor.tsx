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
    <div>
      <p className="text-gray-600">Browse through doctors by specialty.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6FFF] text-white' : ''}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {[
            'General physician', 
            'Gynecologist', 
            'Dermatologist', 
            'Pediatricians', 
            'Neurologist', 
            'Gastroenterologist'
          ].map(spec => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === spec ? 'bg-indigo-100 text-black font-medium' : ''}`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterDoc.length > 0 ? (
            filterDoc.map((item) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300"
                key={item._id}
              >
                <img className="bg-blue-50 w-full h-48 object-cover" src={item.image} alt={item.name} />
                <div className="p-4 text-center">
                  <div className={`flex items-center justify-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`} />
                    <span>{item.available ? 'Available' : 'Not Available'}</span>
                  </div>
                  <p className="text-gray-900 text-lg font-medium mt-1">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              {speciality ? `No doctors found for: ${speciality}` : 'No doctors available.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;
