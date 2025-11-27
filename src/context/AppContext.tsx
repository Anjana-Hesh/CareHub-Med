import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDoctorsDataService } from "../services/doctor";
import { loadUserProfileDataService } from "../services/auth";

interface AppContextType {
  doctors: any[];
  getDoctorsData: () => Promise<void>;
  currencySymbol: string;
  currency: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  backendUrl: string;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  loadUserProfileData: () => Promise<void>;
  calculateAge: (dob: string) => number;
  slotDateFormat: (slotDate: string) => string;
}

export const AppContext = createContext<AppContextType>({
  doctors: [],
  getDoctorsData: async () => {},
  currencySymbol: " ( LKR )",
  currency: "LKR: ",
  token: null,
  setToken: () => {},
  backendUrl: "",
  userData: null,
  setUserData: () => {},
  loadUserProfileData: async () => {},
  calculateAge: () => 0,
  slotDateFormat: () => ""
});

interface AppContextProviderProps {
  children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const currencySymbol = " ( LKR )";
  const currency = "LKR: ";
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') ? localStorage.getItem('token') : null
  );
  const [userData, setUserData] = useState<any>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const slotDateFormat = (slotDate: string): string => {
    if (!slotDate) return '-';
    const dateArray = slotDate.split('-');
    const year = dateArray[0];
    const monthIndex = Number(dateArray[1]) - 1;
    const day = dateArray[2];
    return `${day} ${months[monthIndex]} ${year}`;
  };

  const getDoctorsData = async () => {
    try {
      const data = await getDoctorsDataService();

      if (data.doctors) {
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
    const response = await loadUserProfileDataService();

    if (response?.success && response.userData) {
      setUserData(response.userData);
    } else {
      const msg = response?.message || "Failed to load profile";
      toast.error(msg);
    }
  } catch (error: any) {
    console.error("Error fetching profile:", error);

    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while fetching profile";

    toast.error(msg);
  }
};


  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value: AppContextType = {
    doctors,
    getDoctorsData,
    currencySymbol,
    currency,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    calculateAge,
    slotDateFormat
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;