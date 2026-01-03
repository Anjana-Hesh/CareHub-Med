import { useContext, useEffect } from 'react';
import { AdminContext, type DoctorType } from '../../context/AdminContext';

const DoctorsList: React.FC = () => {
  const adminContext = useContext(AdminContext);

  if (!adminContext) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Admin context not available
      </div>
    );
  }

  const { doctors, aToken, getAllDoctors, changeAvailability } = adminContext;

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  if (doctors === null || doctors === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          No Doctors Found
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          There are no doctors in the system at the moment or the list could not be loaded.
        </p>
        <button
          onClick={getAllDoctors}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
        >
          Refresh List
        </button>
      </div>
    );
  }

  return (
    <div 
      className="
        min-h-screen 
        bg-linear-to-br from-indigo-50 via-white to-blue-50 
        pb-12
        lg:ml-64
      "
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 ml-10">
        <div className="py-6 sm:py-8 border-b border-gray-200/80">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Doctors
              </h1>
              <p className="mt-2 text-gray-600">
                {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered
              </p>
            </div>
          </div>
        </div>

        <div className="py-6 sm:py-10">
          <div 
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              2xl:grid-cols-5 
              gap-5 sm:gap-6
            "
          >
            {doctors.map((doctor: DoctorType) => (
              <div
                key={doctor._id}
                className="
                  bg-white 
                  rounded-xl 
                  shadow-sm 
                  border border-gray-200/80 
                  overflow-hidden 
                  hover:shadow-md 
                  hover:border-indigo-200/60 
                  transition-all duration-300 
                  group
                "
              >
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="
                      w-full 
                      h-48 sm:h-52 
                      object-cover 
                      bg-indigo-50 
                      group-hover:bg-indigo-100 
                      transition-colors duration-500
                    "
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`
                        px-2.5 py-1 
                        text-xs font-medium 
                        rounded-full 
                        border 
                        ${doctor.available 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'}
                      `}
                    >
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-indigo-600 mt-1 font-medium">
                    {doctor.specialization || 'General Medicine'}
                  </p>

                  <div className="mt-4 flex items-center">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={doctor.available}
                        onChange={() => changeAvailability(doctor._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 select-none">
                        Available
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;