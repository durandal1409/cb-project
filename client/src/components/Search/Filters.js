import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { taxonomy } from "../../data";

const Filters = ({currentCategory, currentSubcategory}) => {
    // TODO:
    // make sure it's possible to go to a category with whitespaces

    const params = useParams();
    const paramsArr = params["*"].split("/");

    const recursiveCategory = (categoriesObj, paramsArr, depth, path) => {
        if (Object.keys(categoriesObj).length === 0) {
            return 
        } else {
            return (
                <UList className={`depth-${depth}`}>
                    {Object.keys(categoriesObj).map(category => {
                        return (
                            <li 
                                key={`${path}/${category}`}
                                className={category.toLowerCase() === paramsArr[depth] ? "current" : null}
                            >
                                <Anchor 
                                    to={`${path}/${category.toLowerCase()}`}
                                    className={category.toLowerCase() === paramsArr[depth] ? "current" : null}
                                >
                                    {category}
                                </Anchor>
                                {category.toLowerCase() === paramsArr[depth] &&
                                    recursiveCategory(categoriesObj[category], paramsArr, depth + 1, `${path}/${category.toLowerCase()}`)
                                }
                            </li>
                        )
                    })}
                </UList>
            )
        }
        
    }

    useEffect(() => {
        // setBigCategories(mainCategories);
        // setSubcategories(smallCategories);
    }, []);
    return (
        <Wrapper>
            <h3>Category</h3>
            {recursiveCategory(taxonomy, paramsArr, 0, "/search")}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: var(--small-block-width);
    background-color: var(--color-background);
    padding-left: 10px;
`
const Anchor = styled(Link)`
    text-decoration: none;
    &:hover {
        color: var(--color-button-hover);
    }
    &.current {
        text-decoration: underline;
    }
    `
const UList = styled.ul`
    &.depth-0 {
        li {
            padding: 10px;
            ${Anchor} {
                font-size: 1.3rem;
            }
        }
    }
    &.depth-1 {
        li {
            padding: 10px 10px 10px 20px;
            &.current {
                background-color: var(--color-background-dark);
            }
            ${Anchor} {
                font-size: 1.2rem;
            }
        }
    }
    &.depth-2 {
        li {
            padding: 10px 10px 10px 30px;
            &.current {
                background-color: var(--color-background-white);
            }
            ${Anchor} {
                font-size: 1.1rem;
            }
        }
    }
`

export default Filters;