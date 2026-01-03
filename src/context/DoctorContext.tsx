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

  // const isDateReached = (appointmentDate: string): boolean => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  
  //   const targetDate = new Date(appointmentDate);
  //   return targetDate <= today;
  // };


  // const isAppointmentTimePassed = (slotDate: string, slotTime: string): boolean => {
  //   try {
  //     let appointmentDateTime: Date;
      
  //     // Check if it's ISO format or custom format
  //     if (slotDate.includes('T') || (slotDate.includes('-') && slotDate.split('-').length === 3 && slotDate.split('-')[0].length === 4)) {
  //       // ISO format: "2026-01-02"
  //       appointmentDateTime = new Date(slotDate);
  //     } else {
  //       // Custom format: "2-1-2026" (day-month-year)
  //       const dateParts = slotDate.split('-');
  //       const day = parseInt(dateParts[0]);
  //       const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JS
  //       const year = parseInt(dateParts[2]);
  //       appointmentDateTime = new Date(year, month, day);
  //     }
      
  //     // Parse the slot time (format: "10:30 AM" or "2:00 PM")
  //     const timeStr = slotTime.trim();
  //     const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      
  //     if (!timeParts) {
  //       console.error('Invalid time format:', slotTime);
  //       return false;
  //     }
      
  //     let hours = parseInt(timeParts[1]);
  //     const minutes = parseInt(timeParts[2]);
  //     const period = timeParts[3].toUpperCase();
      
  //     // Convert to 24-hour format
  //     if (period === 'PM' && hours !== 12) {
  //       hours += 12;
  //     } else if (period === 'AM' && hours === 12) {
  //       hours = 0;
  //     }
      
  //     // Set the time on the appointment date
  //     appointmentDateTime.setHours(hours, minutes, 0, 0);
      
  //     // Current datetime
  //     const now = new Date();
      
  //     // Check if appointment time has passed
  //     return appointmentDateTime <= now;
      
  //   } catch (error) {
  //     console.error('Error parsing date/time:', error);
  //     return false;
  //   }
  // };

//   const isAppointmentTimePassed = (slotDate: string, slotTime: string): boolean => {
//   try {
//     // =========================
//     // 1️⃣ Parse slotDate (DD-MM-YYYY)
//     // =========================
//     const [day, month, year] = slotDate.split('-').map(Number);

//     // =========================
//     // 2️⃣ Parse slotTime (hh:mm AM/PM)
//     // =========================
//     const [time, modifier] = slotTime.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (modifier === 'PM' && hours !== 12) {
//       hours += 12;
//     }
//     if (modifier === 'AM' && hours === 12) {
//       hours = 0;
//     }

//     // =========================
//     // 3️⃣ Create appointment Date object
//     // =========================
//     const appointmentDateTime = new Date(
//       year,
//       month - 1,
//       day,
//       hours,
//       minutes,
//       0,
//       0
//     );

//     // =========================
//     // 4️⃣ Current Date & Time
//     // =========================
//     const now = new Date();

//     // =========================
//     // 5️⃣ Check if appointment time has passed
//     // =========================
//     return appointmentDateTime <= now;

//   } catch (error) {
//     console.error('Error parsing appointment date/time:', error);
//     return false;
//   }
// };


  const completeAppointment = async (appointmentId: string) => {
    try {

      // const appointment = appointments.find(app => app._id === appointmentId);

      // if (!isAppointmentTimePassed(appointments.find(app => app._id === appointmentId)?.date || '', appointments.find(app => app._id === appointmentId)?.time || '')) {
      //   Swal.fire({
      //     icon: 'info',
      //     title: 'Wait a moment!',
      //     text: 'The appointment date has not arrived yet. You can only complete it on or after the scheduled date.',
      //     confirmButtonColor: '#5f6FFF',
      //   });
      //   return;
      // }
          
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

    // const appointment = appointments.find(app => app._id === appointmentId);

    // if (!isAppointmentTimePassed(appointment?.date || '', appointment?.time || '')) {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Cannot Cancel Yet',
    //     text: 'The appointment date has not arrived yet. You can only manage it on or after the scheduled date.',
    //     confirmButtonColor: '#5f6FFF',
    //   });
    //   return;
    // }

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
