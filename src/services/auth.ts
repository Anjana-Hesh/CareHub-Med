import api from "./api"

export const register = async (name: string , email: string , password: string ) => {
    const resp = await api.post("/user/register", { name, email, password })

    return resp.data
}


export const login = async (email: string , password: string) => {
    const resp = await api.post("/user/login" , {email , password})    // base url athi bawin ethnin passe kotasa methnadi diya hakiya

    return resp.data
}

export const loadUserProfileDataService = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/user/get-profile", {
        headers: {
            token: token
        }
    });

    return resp.data;
};

export const bookAppointmentService = async (docId: any , slotDate:any, slotTime: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    const resp = await api.post('/user/book-appointment' , {docId, slotDate, slotTime } , {headers: { token }} )
    return resp.data;
}

export const getUserAppointmentsService = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    const resp = await api.get("/user/appointments" , {
        headers: {
            token: token
        }
    })

    return resp.data;
}

export const cancelAppointmentService = async (appointmentId: any) => {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/user/cancel-appointment" , {appointmentId} ,{
        headers: {
            token: token
        }
    })

    return resp.data;
}

export const updateUserDataService = async (formData: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token not found");
    }

    const resp = await api.post("/user/update-profile" , formData ,{
        headers: {
            token: token
        }
    })

    return resp.data;
}

export const refreshTokens = async (refreshToken: string) => {
    const resp = await api.post("/user/refresh", { token: refreshToken })
    return resp.data
}

export const sendPasswordResetEmail = async (email: string) => {
    
    const resp = await api.post("/user/forget-password", { email })
    
    return resp.data
}

// export const resetPassword = async (token: any, newPassword: string) => {
//     const resp = await api.put(`/user/reset-password/${token}`, { newPassword });
//     return resp.data;
// }

export const resetPassword = async (token: string, newPassword: string) => {
    const resp = await api.put(
        `/user/reset-password`,
        { newPassword },
        { headers: { "x-reset-token": token } }
    );
    return resp.data;
};

