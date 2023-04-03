import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mainCategories, smallCategories } from "../data";

const Filters = ({currentCategory, currentSubcategory}) => {

    const [bigCategories, setBigCategories] = useState(null);
    const [subcategories, setSubcategories] = useState(null);
    useEffect(() => {
        setBigCategories(mainCategories);
        setSubcategories(smallCategories);
    }, []);
    return (
        <Wrapper>
            <h3>Category</h3>
            <ul>
                {bigCategories && bigCategories.map(cat => {
                    return (
                    <li>
                        <Anchor to={`/search/${cat.toLowerCase()}/all`}>
                            {cat}
                            {currentCategory === cat && 
                                <ul>
                                    {Object.keys(subcategories).map(subcat => {
                                        return (
                                            <li>
                                                <Anchor to={`/search/${cat.toLowerCase()}/all`}>
                                                    {cat}
                                                    {currentCategory === cat && 
                                                        <ul>
                                                            {Object.keys(subcategories).map(subcat => {
                                                                return (
                                                                    
                                                                )
                                                            })}
                                                        </ul>
                                                    }
                                                </Anchor>
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                        </Anchor>
                    </li>
                )})}
                <li><Anchor to="/search/women/all">Women</Anchor></li>
                <li><Anchor to="/search/men/all">Men</Anchor></li>
                <li><Anchor to="/search/kids/all">Kids</Anchor></li>
            </ul>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: var(--small-block-width);
    border: 1px solid black;
    background-color: var(--color-background);
`
const Anchor = styled(Link)`
    text-decoration: none;
`

export default Filters;