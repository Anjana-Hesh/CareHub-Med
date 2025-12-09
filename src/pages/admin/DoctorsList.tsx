import { useContext, useEffect } from 'react';
import { AdminContext, type DoctorType } from '../../context/AdminContext';

const DoctorsList: React.FC = () => {
  const adminContext = useContext(AdminContext);

  if (!adminContext) return <div>Context not available</div>;

  const { doctors, aToken, getAllDoctors, changeAvailability } = adminContext;

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  if (!doctors || doctors.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
        <p className="text-gray-600 mb-4">No doctors available at the moment.</p>
        <button
          onClick={getAllDoctors}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh List
        </button>
      </div>
    );
  }

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-4">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4">
        {doctors.map((item: DoctorType, index: number) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={item._id}
          >
            <img
              className="bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500 w-full h-32 object-cover"
              src={item.image}
              alt={`${item.name} Image`}
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm">{item.specialization}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
