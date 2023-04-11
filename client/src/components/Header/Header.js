import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useAuth0 } from "@auth0/auth0-react";

import { CategoriesContext } from "../CategoriesContext";
import { UserContext } from "../UserContext";
import LoginBtn from "./LoginBtn";
import UserInHeader from "./UserInHeader";
import Button from "../shared/Button";

const Header = () => {
    const { isLoading, error, user } = useAuth0();
    const [formData, setFormData] = useState({input: '', dropdown: ''});
    const { categories, setCategories } = useContext(CategoriesContext);
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setCategories(data.data);
                    // console.log(data.message);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
            
    }, []);

    useEffect(() => {
        console.log("fetch user: ", user?.sub);
        user && fetch("/api/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id: user.sub,
                fname: user.given_name,
                lname: user.family_name,
                email: user.email,
                avatar: user.picture,
                ads: [],
                last_search: ""
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 201 || data.status === 200) {
                    console.log(data.message, data.data._id === user.sub);
                    setUserData(data.data);
                    if (data.status === 201) {
                        window.alert("Created user.");
                    }
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
            
    }, [user]);


    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }
    const handleFormSubmit = (e, formData) => {
        e.preventDefault();
        // if (!formData.input) {
        //     return
        // }
        navigate(`/search?categories=/${formData.dropdown?.toLowerCase()}&search=${formData.input}`)
    }
    const handlePostAdClick = () => {
        if (user) {
            navigate('/create-ad');
        } else {
            window.alert("Please, log in.");
        }
    }

    return (
        <WrapperFullWidth>
            <Wrapper>
                <LogoWrapper>
                    <LogoText to="/">CoolLogo</LogoText>
                </LogoWrapper>
                <Form onSubmit={(e) => handleFormSubmit(e, formData)}>
                    <Input 
                        type="text" 
                        placeholder="What are you looking for?"
                        value={formData.input}
                        onChange={(e) => handleChange("input", e.target.value)}
                    />
                    <Dropdown onChange={(e) => handleChange("dropdown", e.target.value)}>
                        <option value="">All Categories</option>
                        {categories && Object.keys(categories).map((category => {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            )
                        }))}
                    </Dropdown>
                    <Button type={"submit"}>Search</Button>
                </Form>
                <Anchor to={"/favourites"}>
                    <AiOutlineHeart size={'2rem'}/>
                </Anchor>
                {!error && !isLoading && 
                    <>
                        <LoginBtn />
                        <UserInHeader />
                    </>
                }
                <Button type={"button"} handleClick={handlePostAdClick}>Post ad</Button>
            </Wrapper>
        </WrapperFullWidth>
    )
}

const WrapperFullWidth = styled.div`
    width: 100%;
`
const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: var(--content-width);
    margin: auto;
    padding: 20px 0;
    justify-content: space-between;
`
const LogoWrapper = styled.div`

`
const LogoText = styled(Link)`
    text-decoration: none;
    font-size: 35px;
    color: var(--color-button);
`
const Form = styled.form`
    display: flex;
`
const Input = styled.input`
    width: 250px;
    border: 1px solid var(--color-button);
    border-radius: 7px 0 0 7px;
`
const Dropdown = styled.select`
    width: 150px;
    border: 1px solid var(--color-button);
    margin-right: -7px;
    z-index: 2;
`
const Anchor = styled(Link)`
    text-decoration: none;
    svg {
        color: var(--color-button);
        &:hover {
            color: var(--color-button-hover);
        }
    }
`

export default Header;