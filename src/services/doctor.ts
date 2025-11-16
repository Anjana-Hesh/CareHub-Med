import api from "./api"

export const getDoctorsDataService = async () => {

    const resp = await api.get("/doctor/list")

    return resp.data
}