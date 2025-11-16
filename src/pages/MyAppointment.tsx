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

interface Appointment {
  docData: DocData;
  slotDate: string;
  slotTime: string;
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MyAppointment: React.FC = () => {
  const { backendUrl, token , getDoctorsData} = useContext(AppContext);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const slotDateFormat = (slotDate: string) => {
    if (!slotDate) return '-';
    const dateArray = slotDate.split('-');
    const year = dateArray[0];
    const monthIndex = Number(dateArray[1]) - 1;
    const day = dateArray[2];
    return `${day} ${months[monthIndex]} ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      // const { data } = await axios.get(`${backendUrl}/api/v1/user/appointments`, {
      //   headers: { token }
      // });

      const data = await getUserAppointmentsService()

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

  const cancelAppointment = async (appointmentId) => {

    try {
      
      // console.log(appointmentId)
      // const { data } = await axios.post(`${backendUrl}/api/v1/user/cancel-appointment`, {appointmentId}, {headers: {token: token}})
      const data = await cancelAppointmentService(appointmentId)

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }

  }

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
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData?.image || '/placeholder.png'}
                  alt={item.docData?.name || 'Doctor'}
                />
              </div>

              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData?.name || 'N/A'}</p>
                <p>{item.docData?.speciality || 'N/A'}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData?.address?.line1 || '-'}</p>
                <p className="text-xs">{item.docData?.address?.line2 || '-'}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time</span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime || '-'}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">

                {
                  !item.cancelled && !item.isCompleted && <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300">
                                      Pay Online
                                    </button>
                }
                
                {
                  !item.cancelled && !item.isCompleted && <button onClick={()=> cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                                        Cancel appointment
                                      </button>
                }

                {
                  item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'> Appointment cancelled</button>
                }

                {
                  item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'> Completed ... </button>
                }
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
