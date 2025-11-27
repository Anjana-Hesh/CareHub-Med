import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { doctorCancelAppintmentsService, doctorCompleteAppintmentsService, getAppointmentsService, getDashDataService, getProfileDataService } from "../services/doctor";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken , setDToken] = useState(localStorage.getItem('dToken')? localStorage.getItem('dToken') : '')
    const [ appointments , setAppointments] = useState([])
    const [dashData , setDashData] = useState(false)
    const [profileData , setProfileData] = useState(false)

    const getAppointments = async () => {

        try {

            // const { data } = await axios.get(`${backendUrl}/api/v1/doctor/appointments` , {headers: {dtoken: dToken}} )
            const data = await getAppointmentsService()

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
            
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const completeAppointment = async (appointmentId: string) => {

        try {

            // const {data} = await axios.post(`${backendUrl}/api/v1/doctor/complete-appointment` , {appointmentId} , {headers: {dtoken : dToken}})
            const data = await doctorCompleteAppintmentsService(appointmentId)

            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const cancelAppointment = async (appointmentId : string) => {

        try {

            // const {data} = await axios.post(`${backendUrl}/api/v1/doctor/cancel-appointment` , {appointmentId} , {headers: {dtoken : dToken}})
            const data = await doctorCancelAppintmentsService(appointmentId)

            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const getDashData = async () => {

        try {

            // const {data} = await axios.get(`${backendUrl}/api/v1/doctor/dashboard`, {headers: {dtoken : dToken}})
            const data = await getDashDataService()

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
            
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const getProfileData = async () => {

        try {

            // const {data} = await axios.get(`${backendUrl}/api/v1/doctor/profile` , {headers: {dtoken : dToken}})
            const data = await getProfileDataService()

            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            } else {
                toast.error(data.message)
            }
            
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = {
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
        getProfileData
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider