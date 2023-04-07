import styled from "styled-components";
import { taxonomy } from "../../data";
import { useState } from "react";

const Categories = () => {
    const [categories, setCategories] = useState({});

    const handleChange = (e, depth) => {
        setCategories(prev => ({...prev, [depth]: e.target.value}));
    }

    
    const recursiveCategory = (categoriesObj, depth) => {
        console.log("categoriesObj: ", categoriesObj, "categories:", categories, "depth: ", depth);
        if ((categoriesObj && Object.keys(categoriesObj).length === 0)) {
            console.log("exit", categoriesObj[categories[depth]], categoriesObj, categories, depth);
            return 
        } else {
            return (
                <>
                    <Dropdown onChange={(e) => handleChange(e, depth)}>
                        <option value="">Select category</option>
                        {Object.keys(categoriesObj).map(category => {
                            return (
                                <option 
                                    key={`${category}`}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        })}
                    </Dropdown>
                    {categoriesObj[categories[depth]] && recursiveCategory(categoriesObj[categories[depth]], depth + 1)}
                </>
            )
        }
        
    }
    return (
        <CategoriesWrapper>
            <h3>Select Categories</h3>
                {recursiveCategory(taxonomy, 0)}
        </CategoriesWrapper>
    )
}

const CategoriesWrapper = styled.div`

`
const Dropdown = styled.select`

`

export default Categories;