import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDoctorsDataService } from "../services/doctor";
import { loadUserProfileDataService } from "../services/auth";

// Type for context value
interface AppContextType {
  doctors: any[];
  getDoctorsData: () => Promise<void>;
  currencySymbol: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  backendUrl: string;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loadUserProfileData: () => Promise<void>;
}

// Default empty context value (for initialization)
export const AppContext = createContext<AppContextType>({
  doctors: [],
  getDoctorsData: async () => {},
  currencySymbol: " ( LKR )",
  token: null,
  setToken: () => {},
  backendUrl: "",
  userData: null,
  setUserData: () => {},
  loadUserProfileData: async () => {},
});

// Type for provider props
interface AppContextProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const currencySymbol = " ( LKR )";
  const [token , setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') :  "");
  const[userData , setUserData] = useState(false)

  const getDoctorsData = async () => {
    try {
      // const { data } = await axios.get(`${backendUrl}/api/v1/doctor/list`);
      const data = await getDoctorsDataService()

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {

    try {
      
      // const { data } = await axios.get(`${backendUrl}/api/v1/user/get-profile`,{headers: {token:token}})
      const data = await loadUserProfileDataService()

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect (() => {

    if (token) {
      loadUserProfileData()
    }else{
      setUserData(false)
    }

  },[token])

  const value: AppContextType = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token ,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
