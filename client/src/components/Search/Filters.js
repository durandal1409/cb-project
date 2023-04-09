import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { taxonomy } from "../../data";

const Filters = ({setFilteredAds}) => {
    // TODO:
    // make sure it's possible to go to a category with whitespaces

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // making array of chosen categories out of params
    const paramsArr = params["*"].split("/");

    console.log("url: ", params["*"], searchParams.get("q"));

    // function makes lists of nested categories to filter ads
    // it recursively goes through keys of nested objects of categoriesObj
    // making list of nested categories for each category that has been clicked
    // it stops when category has no nested categories
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
                                    to={`${path}/${category.toLowerCase()}?q=${searchParams.get("q")}`}
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
        // setFilteredAds(smallAdsArr);
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
    li {
        border-radius: 10px;
    }
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