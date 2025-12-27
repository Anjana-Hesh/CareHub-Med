import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { cancelAppointmentService, getUserAppointmentsService } from '../services/auth';
import Swal from 'sweetalert2';

interface Address {
  line1: string;
  line2: string;
}

interface DocData {
  name: string;
  speciality: string;
  image: string;
  address: Address;
}

export interface Appointment {
  _id: string;
  docData: DocData;
  slotDate: string;
  slotTime: string;
  cancelled: boolean;
  isCompleted: boolean;
}

interface AppointmentsResponse {
  success: boolean;
  message?: string;
  appointments: Appointment[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MyAppointment: React.FC = () => {
  const { token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
  };

  const fetchAppointments = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getUserAppointmentsService();
      
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments([...data.appointments].reverse());
      } else {
        setAppointments([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string): Promise<void> => {
    if (cancellingId) return; // Prevent multiple clicks
    
    // if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
      const result = await Swal.fire({
        title: 'Cancel Appointment?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No, keep it',
      });
    
      if (!result.isConfirmed) return;

    setCancellingId(id);
    try {
      const data = await cancelAppointmentService(id);
      
      if (data.success) {
        toast.success(data.message || 'Appointment cancelled');
        await fetchAppointments();
        getDoctorsData?.();
      } else {
        toast.error(data.message || 'Failed to cancel appointment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const { docData, slotDate, slotTime, cancelled, isCompleted, _id } = appointment;
    const isActive = !cancelled && !isCompleted;
    const isCancelling = cancellingId === _id;

    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
       
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-indigo-50"
            src={docData.image || '/placeholder.png'}
            alt={docData.name}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{docData.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{docData.speciality}</p>
          
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-700">Address:</span>
            <p className="text-xs text-gray-600">{docData.address.line1}</p>
            <p className="text-xs text-gray-600">{docData.address.line2}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">Time:</span>
            <span className="text-gray-600">
              {formatDate(slotDate)} | {slotTime}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[160px]">
          {isActive && (
            <>
              <button 
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() =>
                  Swal.fire({
                    icon: 'info',
                    title: 'Coming Soon',
                    text: 'Online payment feature will be available soon!',
                  })
                }
              >
                Pay Online
              </button>
              <button 
                className={`px-4 py-2 text-sm border rounded transition-colors ${
                  isCancelling
                    ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                    : 'border-red-500 text-red-600 hover:bg-red-50'
                }`}
                onClick={() => handleCancelAppointment(_id)}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </>
          )}
          
          {cancelled && !isCompleted && (
            <div className="px-4 py-2 text-sm border border-red-300 text-red-500 bg-red-50 rounded text-center">
              Cancelled
            </div>
          )}
          
          {isCompleted && (
            <div className="px-4 py-2 text-sm border border-green-300 text-green-600 bg-green-50 rounded text-center">
              Completed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-600 mt-2">View and manage your upcoming appointments</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading appointments...</div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <div className="text-gray-400 mb-2">📅</div>
          <p className="text-gray-500">No appointments found</p>
          <p className="text-sm text-gray-400 mt-1">Book an appointment to see it here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;