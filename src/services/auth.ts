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

export const bookAppointmentService = async (docId , slotDate, slotTime) => {
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

export const cancelAppointmentService = async (appointmentId) => {

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

export const updateUserDataService = async (formData) => {
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