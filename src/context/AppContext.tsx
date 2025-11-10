import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Type for context value
interface AppContextType {
  doctors: any[];
  currencySymbol: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  backendUrl: string;
}

// Default empty context value (for initialization)
export const AppContext = createContext<AppContextType>({
  doctors: [],
  currencySymbol: " ( LKR )",
  token: null,
  setToken: () => {},
  backendUrl: ""
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

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/doctor/list`);

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

  useEffect(() => {
    getDoctorsData();
  }, []);

  const value: AppContextType = {
    doctors,
    currencySymbol,
    token ,
    setToken,
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
