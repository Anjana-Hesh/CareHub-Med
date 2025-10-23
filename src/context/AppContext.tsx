// import { createContext } from "react";
// import { doctors } from "../assets/assets";

// export const AppContext = createContext

// const AppContextProvider = (props) => {

    

//     const value = {
//         doctors
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

// export default AppContextProvider


import { createContext, ReactNode } from "react";
import { doctors } from "../assets/assets";

// 1. Create context properly with a default value
export const AppContext = createContext({
  doctors: [] as typeof doctors // TypeScript knows doctors' type
});

// 2. Type the props for your provider
interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const value = {
    doctors
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
