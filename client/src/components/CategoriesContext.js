import { createContext } from "react";
import { useState } from "react";

// for clothing categories object to use it
// on search page, create ad page and in header
export const CategoriesContext = createContext(null);

export const CategoriesProvider = ({children}) => {
    const [categories, setCategories] = useState(null);
    return (
        <CategoriesContext.Provider value={{categories, setCategories}}>
            {children}
        </CategoriesContext.Provider>
    )
}