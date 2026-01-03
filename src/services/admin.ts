import api from "./api";

export const getAllDoctorsService = async () => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/admin/all-doctors", {} , {
        headers: {
            atoken: aToken
        }
    });

    return resp.data;
}

export const changeAvailabilityService = async (docId: string) => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/admin/change-availability", {docId} , {
        headers: {
            atoken: aToken
        }
    });

    return resp.data;
}

export const getAllAppointmentsService = async () => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/admin/appointments", {
        headers: {
            atoken: aToken
        }
    })

    return resp.data;
}

export const adminCancelAppintmentsService = async (appointmentId: string) => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/admin/cancel-appointment", {appointmentId} , {
        headers: {
            atoken: aToken
        }
    });

    return resp.data;
}

export const getDashDataService = async () => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/admin/dashboard", {
        headers: {
            atoken: aToken
        }
    })

    return resp.data;
}

export const addDoctorService = async (formData: FormData) => {
    const aToken = localStorage.getItem("aToken");

    if (!aToken) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/admin/add-doctor", formData , {
        headers: {
            atoken: aToken
        }
    });

    return resp.data;
}

// export const adminLogin = async (email: string , password: string) => {
//     const resp = await api.post("/admin/login" , {email , password})    // base url athi bawin ethnin passe kotasa methnadi diya hakiya

//     return resp.data
// }