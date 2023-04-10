import styled from "styled-components";
import { useContext } from "react";

import { CategoriesContext } from "../CategoriesContext";

const Categories = ({formData, setFormData}) => {

    const { categories } = useContext(CategoriesContext);

    const handleChange = (e, depth) => {
        setFormData((prevState) => {
            // if category from current dropdown isn't in state
            // then add value to state and assign value of "" to the next dropdown
            if (formData.categories[depth] === undefined) {
                return {
                    ...prevState,
                    categories: [...prevState.categories, e.target.value, ""]
                }
            } else {
                // if category from current dropdown is in state
                // then we need to change it with map and assign value of "" to the next dropdown
                // and remove all child categories after "" (filter)
                const newCategories = prevState.categories
                        .filter((category, ind) => ind <= depth + 1)
                        .map((category, ind) => {
                            if (ind === depth) {
                                category = e.target.value;
                            } else if (ind === depth + 1) {
                                category = "";
                            }
                            return category;
                        })
                return {...prevState, categories: newCategories}
            }
        });
        
    }

    // the function recursively creates Dropdowns with categories
    // it exits when categoriesObj has no nested objects
    // it also stops if no next category selected
    const recursiveCategory = (categoriesObj, depth) => {
        // console.log("categoriesObj: ", categoriesObj, "categories:", categories, "depth: ", depth);
        if ((Object.keys(categoriesObj).length === 0)) {
            // console.log("exit - no nested objects");
            return 
        } else {
            // console.log("continue");
            return (
                <>
                    <Dropdown onChange={(e) => handleChange(e, depth)} required value={formData.categories[depth]}>
                        <option value="" >Select category</option>
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
                    {categoriesObj[formData.categories[depth]] && recursiveCategory(categoriesObj[formData.categories[depth]], depth + 1)}
                </>
            )
        }
        
    }
    return (
        <CategoriesWrapper>
            <h4>Select Categories</h4>
            {categories
                ?   recursiveCategory(categories, 0)
                : <h3>Loading...</h3>
            }
        </CategoriesWrapper>
    )
}

const CategoriesWrapper = styled.div`

`
const Dropdown = styled.select`
    font-size: 1.2rem;
    border: 1px solid var(--color-button);
    border-radius: 7px;
    display: block;
    margin-bottom: 10px;
    width: 200px;
    height: 36px;
`

export default Categories;