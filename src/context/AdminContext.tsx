// import { createContext, useState } from "react";
// import { toast } from "react-toastify";
// import { adminCancelAppintmentsService, changeAvailabilityService, getAllAppointmentsService, getAllDoctorsService, getDashDataService } from "../services/admin";

// export const AdminContext = createContext()

// const AdminContextProvider = (props: any) => {

//     const [aToken , setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken') : '')
//     const [doctors,setDoctors] = useState([])
//     const [appointments , setAppointments] = useState([])
//     const [dashData , setDashData] = useState(false)

//     const backendUrl = import.meta.env.VITE_BACKEND_URL    // env varialble usages

//     const getAllDoctors = async () => {
//         try {
            
//             // const { data } = await axios.post(
//             //                     `${backendUrl}/api/v1/admin/all-doctors`,
//             //                     {},
//             //                     { headers: { atoken: aToken } }
//             //                 );
//             const data = await getAllDoctorsService()

//             if(data.success){
//                 setDoctors(data.doctors)
//                 console.log(data.doctors)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error: any) {
//             toast.error(error.message)
//         }
//     }

//     const changeAvailability = async (docId) => {

//         try {
            
//             // const { data } = await axios.post(
//             //     `${backendUrl}/api/v1/admin/change-availability`,
//             //     {docId},
//             //     { headers: { atoken: aToken } }
//             // )
//             const data = await changeAvailabilityService(docId)

//             if (data.success) {
//                 toast.success(data.message)
//                 getAllDoctors()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error: any) {
//             toast.error(error.message)
//         }

//     }

//     const getAllAppointments = async () => {

//         try {

//             // const { data } = await axios.get(`${backendUrl}/api/v1/admin/appointments`, {headers: { atoken: aToken }})
//             const data = await getAllAppointmentsService()

//             if (data.success) {
//                 setAppointments(data.appointments)
//                 console.log(data.appointments);

//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error: any) {
//             toast.error(error.message)
//         }

//     }

//     const cancelAppointment = async (appointmentId) => {

//         try {

//             // const {data} = await axios.post(`${backendUrl}/api/v1/admin/cancel-appointment`, {appointmentId}, {headers: { atoken: aToken }})
//             const data = await adminCancelAppintmentsService(appointmentId)

//             if (data.success) {
//                 toast.success(data.message)
//                 getAllAppointments()
//             } else {
//                 toast.error(data.message)
//             }
            
//         } catch (error: any) {
//             toast.error(error.message)
//         }

//     }

//     const getDashData = async () => {

//         try {

//             // const {data} = await axios.get(`${backendUrl}/api/v1/admin/dashboard` , {headers: { atoken: aToken }})
//             const data = await getDashDataService()

//             if (data.success) {
//                 setDashData(data.dashData)
//                 console.log(data.dashData)
//             } else {
//                 toast.error(data.message)
//             }
            
//         } catch (error: any) {
//             toast.error(error.message)
//         }

//     }

//     // to access any other component
//     const value = {
//         aToken ,
//         setAToken,
//         backendUrl,
//         doctors,
//         getAllDoctors,
//         changeAvailability,
//         appointments,
//         setAppointments,
//         getAllAppointments,
//         cancelAppointment,
//         dashData,
//         getDashData

//     }

//     return(
//         <AdminContext.Provider value={value}>
//             {props.children}
//         </AdminContext.Provider>
//     )
// }

// export default AdminContextProvider


import { createContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { adminCancelAppintmentsService, changeAvailabilityService, getAllAppointmentsService, getAllDoctorsService, getDashDataService } from "../services/admin";

export interface DoctorType {
    _id: string;
    name: string;
    specialization: string;
    available: boolean;
}

export interface AppointmentType {
    _id: string;
    patientName: string;
    status: string;
    date: string;
}

export interface DashDataType {
    totalDoctors: number;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
}

export interface AdminContextType {
    aToken: string | null;
    setAToken: (token: string | null) => void;

    backendUrl: string;
    
    doctors: DoctorType[];
    getAllDoctors: () => Promise<void>;

    changeAvailability: (docId: string) => Promise<void>;

    appointments: AppointmentType[];
    setAppointments: (a: AppointmentType[]) => void;
    getAllAppointments: () => Promise<void>;

    cancelAppointment: (appointmentId: string) => Promise<void>;

    dashData: DashDataType | boolean;
    getDashData: () => Promise<void>;
}

// ------------------ CONTEXT ------------------

export const AdminContext = createContext<AdminContextType | null>(null);

interface Props {
    children: ReactNode;
}

const AdminContextProvider = ({ children }: Props) => {

    const [aToken, setAToken] = useState<string | null>(
        localStorage.getItem("aToken") || null
    );

    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [dashData, setDashData] = useState<DashDataType | boolean>(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
        try {
            const data = await getAllDoctorsService();
            if (data.success) {
                setDoctors(data.doctors);
            } else toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId: string) => {
        try {
            const data = await changeAvailabilityService(docId);
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            const data = await getAllAppointmentsService();
            if (data.success) {
                setAppointments(data.appointments);
            } else toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId: string) => {
        try {
            const data = await adminCancelAppintmentsService(appointmentId);
            if (data.success) {
                toast.success(data.message);
                getDashData();
            } else toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {
            const data = await getDashDataService();
            if (data.success) {
                setDashData(data.dashData);
            } else toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const value: AdminContextType = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
