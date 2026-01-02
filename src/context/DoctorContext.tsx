import { createContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import {
  doctorCancelAppintmentsService,
  doctorCompleteAppintmentsService,
  getAppointmentsService,
  getDashDataService,
  getProfileDataService,
} from "../services/doctor";
import Swal from 'sweetalert2';

export type AppointmentType = {
  _id: string;
  patientName: string;
  age: number;
  status: string;
  date: string;
  time: string;
};

export type DashDataType = {
  totalAppointments: number;
  completed: number;
  cancelled: number;
  pending: number;
};

export type ProfileDataType = {
  name: string;
  email: string;
  specialization: string;
  experience: number;
};

export type DoctorContextType = {
  dToken: string;
  setDToken: (value: string) => void;

  backendUrl: string;

  appointments: AppointmentType[];
  setAppointments: (value: AppointmentType[]) => void;
  getAppointments: () => Promise<void>;

  completeAppointment: (appointmentId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;

  dashData: DashDataType | false;
  setDashData: (value: DashDataType | false) => void;
  getDashData: () => Promise<void>;

  profileData: ProfileDataType | false;
  setProfileData: (value: ProfileDataType | false) => void;
  getProfileData: () => Promise<void>;
};

export const DoctorContext = createContext<DoctorContextType | null>(null);

const DoctorContextProvider = ({ children }: { children: ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState<string>(
    localStorage.getItem("dToken") || ""
  );

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [dashData, setDashData] = useState<DashDataType | false>(false);
  const [profileData, setProfileData] = useState<ProfileDataType | false>(false);

  const getAppointments = async () => {
    try {
      const data = await getAppointmentsService();

      if (data.success) {
        console.log("Fetched appointments:", data.appointments);
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isDateReached = (appointmentDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  
    const targetDate = new Date(appointmentDate);
    return targetDate <= today;
  };

  const completeAppointment = async (appointmentId: string) => {
    try {

      const appointment = appointments.find(app => app._id === appointmentId);
  
  if (appointment && !isDateReached(appointment.date)) {
    Swal.fire({
      icon: 'info',
      title: 'Wait a moment!',
      text: 'The appointment date has not arrived yet. You can only complete it on or after the scheduled date.',
      confirmButtonColor: '#5f6FFF',
    });
    return;
  }
      
      const data = await doctorCompleteAppintmentsService(appointmentId);

      if (data.success) {
        toast.success(data.message);
        await getAppointments()
        await getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {

    const appointment = appointments.find(app => app._id === appointmentId);

    if (appointment && !isDateReached(appointment.date)) {
      Swal.fire({
        icon: 'info',
        title: 'Cannot Cancel Yet',
        text: 'The appointment date has not arrived yet. You can only manage it on or after the scheduled date.',
        confirmButtonColor: '#5f6FFF',
      });
      return;
    }

    const result = await Swal.fire({
        title: 'Cancel Appointment?',
        text: 'This appointment will be cancelled permanently.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#5f6FFF',
        confirmButtonText: 'Yes, cancel it',
        cancelButtonText: 'No',
        reverseButtons: true,
      });
    
      if (!result.isConfirmed) return;

    try {
      const data = await doctorCancelAppintmentsService(appointmentId);

      if (data.success) {
        toast.success(data.message);
        await getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const data = await getDashDataService();

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const data = await getProfileDataService();

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const value: DoctorContextType = {
    dToken,
    setDToken,
    backendUrl,

    appointments,
    setAppointments,
    getAppointments,

    completeAppointment,
    cancelAppointment,

    dashData,
    setDashData,
    getDashData,

    profileData,
    setProfileData,
    getProfileData,
  };


  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
