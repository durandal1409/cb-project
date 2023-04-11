import { createContext } from "react";
import { useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const [userData, setUserData] = useState(null);
    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    )
}