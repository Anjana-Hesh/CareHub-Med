import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";
import.meta.env;

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`
    // baseURL: "http://localhost:5000/api/v1"
});

const PUBLIC_ENDPOINTS = ['/user/login', "/user/register", "/user/refresh"];

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];   // 401 errors queue , it hold errors since get a refresh token

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
           
            prom.resolve(token); 
        }
    });
    failedQueue = [];
};

api.interceptors.response.use((response) => {
    return response;
},
    async (error: AxiosError) => {
        const originalRequest: any = error.config;
    
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && 
            !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url))) {

            if (isRefreshing) {
                
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.token = token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                
                isRefreshing = false;
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(new Error("No refresh token available"));
            }

            try {
               
                const { accessToken } = await refreshTokens(refreshToken);
                localStorage.setItem("token", accessToken); 
                
                originalRequest.headers.token = accessToken;
                
                processQueue(null, accessToken);
                
                isRefreshing = false;
                
                return api(originalRequest); 
            } catch (refreshError: any) {
               
                processQueue(refreshError, null);
                isRefreshing = false;
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);   // pass throught other error (without 401)
    }
);

export default api;