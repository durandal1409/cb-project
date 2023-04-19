import styled from "styled-components";
import { useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

import { CategoriesContext } from "../CategoriesContext";

// component for selecting clothing categories.
// It fetches the ads that match selected categories and search phrase.
// It adds query params to url according to selected categories and search phrase.
const Filters = ({setFilteredAds}) => {
    const { user } = useAuth0();
    // clothing categories object
    const { categories } = useContext(CategoriesContext);
    const [searchParams] = useSearchParams();

    // get chosen categories from url
    // remove "/" at the beginning
    // change it to array
    const chosenCategoriesArr = searchParams?.get("categories")?.slice(1).split("/");
    
    // function makes <ul>s with categories to filter ads.
    // It goes through keys of passed categories object making <li>.
    // If category has been clicked the function will call itself
    // to make an <ul> with nested categories inside <li>.
    // It stops if such category has no nested categories.
    const recursiveCategory = (categoriesObj, chosenCategoriesArr, depth, path) => {
        if (Object.keys(categoriesObj).length === 0) {
            return 
        } else {
            return (
                <UList className={`depth-${depth}`}>
                    {Object.keys(categoriesObj).map(category => {
                        {/* check if category is among chosen (which means it was clicked and it's in url query params) 
                        then we need to add 'current' class to elements (for styling)
                        and call a function again to render nested categories*/}
                        const isChosenCategory = chosenCategoriesArr ? category.toLowerCase() === chosenCategoriesArr[depth] : null;
                        return (
                            <li 
                                key={`${path}/${category}`}
                                className={ isChosenCategory ? "current" : null}
                            >
                                <Anchor 
                                    // adding chosen category to url
                                    to={`/search?categories=${path}/${category.toLowerCase()}&search=${searchParams.get("search")}`}
                                    className={isChosenCategory ? "current" : null}
                                >
                                    {category}
                                </Anchor>
                                {isChosenCategory &&
                                    recursiveCategory(categoriesObj[category], chosenCategoriesArr, depth + 1, `${path}/${category.toLowerCase()}`)
                                }
                            </li>
                        )
                    })}
                </UList>
            )
        }
        
    }

    useEffect(() => {
        // fetching ads filtered by search and categories
        fetch(`${process.env.REACT_APP_BASE_URL}/api/ads/search/${user?.sub}?categories=${searchParams?.get("categories")}&search=${searchParams?.get("search")}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setFilteredAds(data.data);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
    }, [user, searchParams]);

    return (
        <Wrapper>
            <h3>Category</h3>
            {categories 
                ?   recursiveCategory(categories, chosenCategoriesArr, 0, "")
                : <h3>Loading...</h3>
            }
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