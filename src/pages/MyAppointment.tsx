import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { cancelAppointmentService, getUserAppointmentsService } from '../services/auth';

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

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MyAppointment: React.FC = () => {
  const { token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const slotDateFormat = (slotDate: string): string => {
    if (!slotDate) return '-';
    const [year, month, day] = slotDate.split('-');
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  const getUserAppointments = async (): Promise<void> => {
    try {
      const data: AppointmentsResponse = await getUserAppointmentsService();

      if (data.success && Array.isArray(data.appointments)) {
        setAppointments([...data.appointments].reverse());
      } else {
        setAppointments([]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
      setAppointments([]);
    }
  };

  const cancelAppointment = async (_id: string): Promise<void> => {
    try {
      const data = await cancelAppointmentService(_id);

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

      <div>
        {appointments.length === 0 ? (
          <p className="text-center text-zinc-500 mt-4">No appointments found</p>
        ) : (
          appointments.map((item) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={item._id}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image || '/placeholder.png'}
                  alt={item.docData.name}
                />
              </div>

              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                <p>{item.docData.speciality}</p>

                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>

                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && !item.isCompleted && (
                  <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300">
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}

                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}

                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed ...
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
