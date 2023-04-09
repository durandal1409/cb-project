import { createContext } from "react";
import { useState } from "react";

export const CategoriesContext = createContext(null);

export const CategoriesProvider = ({children}) => {
    const [categories, setCategories] = useState(null);
    return (
        <CategoriesContext.Provider value={{categories, setCategories}}>
            {children}
        </CategoriesContext.Provider>
    )
}