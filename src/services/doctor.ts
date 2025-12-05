import api from "./api"

export const getDoctorsDataService = async () => {

    const resp = await api.get("/doctor/list")

    return resp.data
}

export const getAppointmentsService = async () => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/doctor/appointments", {
        headers: {
            dtoken: dToken
        }
    })

    return resp.data;
}

export const doctorCancelAppintmentsService = async (appointmentId: string) => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/doctor/cancel-appointment", {appointmentId} , {
        headers: {
            dtoken: dToken
        }
    });

    return resp.data;
}

export const doctorCompleteAppintmentsService = async (appointmentId: string) => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/doctor/complete-appointment", {appointmentId} , {
        headers: {
            dtoken: dToken
        }
    });

    return resp.data;
}

export const getDashDataService = async () => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/doctor/dashboard", {
        headers: {
            dtoken: dToken
        }
    })

    return resp.data;
}

export const getProfileDataService = async () => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/doctor/profile", {
        headers: {
            dtoken: dToken
        }
    })

    return resp.data;
}

export const updateDoctorService = async (updateDate: any) => {
    const dToken = localStorage.getItem("dToken");

    if (!dToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/doctor/update-profile", updateDate , {
        headers: {
            dtoken: dToken
        }
    });

    return resp.data;
}


export const docLogin = async (email: string , password: string) => {
    const resp = await api.post("/doctor/login" , {email , password})    // base url athi bawin ethnin passe kotasa methnadi diya hakiya

    return resp.data
}
