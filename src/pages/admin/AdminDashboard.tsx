import { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assetsAdmin';

interface DoctorData {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
}

interface Appointment {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  docData: DoctorData;
  amount: number;
  date: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
}

interface ActualDashDataType {
  doctors: number;
  appointments: number;
  patients: number;
  latestAppointments: Appointment[];
}

interface StatCard {
  icon: string;
  value: number;
  label: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const adminContext = useContext(AdminContext);
  const appContext = useContext(AppContext);

  if (!adminContext || !appContext) {
    return <div>Context not available</div>;
  }

  const { aToken, getDashData, cancelAppointment, dashData } = adminContext;
  const { slotDateFormat } = appContext;

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  const isValidDashData = (data: any): data is ActualDashDataType => {
    return data && typeof data === 'object' && 'doctors' in data && 'appointments' in data;
  };

  if (!dashData || !isValidDashData(dashData)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-[#5f6FFF] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      icon: assets.doctor_icon,
      value: dashData.doctors,
      label: 'Doctors',
      color: 'text-blue-600'
    },
    {
      icon: assets.appointment_icon,
      value: dashData.appointments,
      label: 'Appointments',
      color: 'text-green-600'
    },
    {
      icon: assets.patients_icon,
      value: dashData.patients,
      label: 'Patients',
      color: 'text-purple-600'
    }
  ];

  const handleCancelAppointment = (appointmentId: string): void => {
    cancelAppointment(appointmentId);
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8'>
        {stats.map((stat: StatCard, index: number) => (
          <div
            key={index}
            className='flex items-center gap-4 bg-white p-5 lg:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer'
          >
            <div className='p-3 bg-gray-50 rounded-lg'>
              <img className='w-10 h-10 lg:w-12 lg:h-12' src={stat.icon} alt={stat.label} />
            </div>
            <div>
              <p className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className='text-gray-500 text-sm lg:text-base mt-1'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        
        <div className='flex items-center gap-3 px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200'>
          <div className='p-2 bg-[#5f6FFF] rounded-lg'>
            <img className='w-5 h-5' src={assets.list_icon} alt="List" />
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-gray-800 text-base lg:text-lg'>Latest Bookings</p>
            <p className='text-xs text-gray-500 mt-0.5'>Recent appointment requests</p>
          </div>
          <span className='bg-[#5f6FFF] text-white text-xs px-3 py-1 rounded-full font-medium'>
            {dashData.latestAppointments.length}
          </span>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img className='w-8 h-8 opacity-50' src={assets.appointment_icon} alt="No appointments" />
              </div>
              <p className='text-gray-500 text-sm'>No appointments yet</p>
            </div>
          ) : (
            dashData.latestAppointments.map((item: Appointment) => (
              <div
                key={item._id}
                className='flex items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4 hover:bg-gray-50 transition-colors'
              >
                <img
                  className='rounded-full w-12 h-12 sm:w-14 sm:h-14 object-cover border-2 border-gray-200'
                  src={item.docData.image}
                  alt={item.docData.name}
                />

                <div className='flex-1 min-w-0'>
                  <p className='text-gray-800 font-semibold text-sm sm:text-base truncate'>
                    {item.docData.name}
                  </p>
                  <p className='text-gray-500 text-xs sm:text-sm mt-1'>
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                <div className='flex-shrink-0'>
                  {item.cancelled ? (
                    <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200'>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200'>
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCancelAppointment(item._id)}
                      className='p-2 hover:bg-red-50 rounded-lg transition-colors group'
                      title='Cancel appointment'
                      aria-label={`Cancel appointment with ${item.docData.name}`}
                    >
                      <img
                        className='w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform'
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;