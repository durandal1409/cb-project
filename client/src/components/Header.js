import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";

import Button from "./shared/Button";

const Header = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputSubmit = () => {

    }

    return (
        <WrapperFullWidth>
            <Wrapper>
                <LogoWrapper>
                    <LogoText to="/">CoolLogo</LogoText>
                </LogoWrapper>
                <Form onSubmit={handleInputSubmit}>
                    <Input 
                        type="text" 
                        placeholder="What are you looking for?" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Dropdown>
                        <option value="">All Categories</option>
                    </Dropdown>
                    <Button type={"submit"}>Search</Button>
                </Form>
                <Anchor to={"/favourites"}>
                    <AiOutlineHeart size={'2em'}/>
                </Anchor>
                <Anchor to={"/my-profile"} >
                    <AiOutlineUser size={'2em'}/>
                </Anchor>
                <Button type={"button"}>Post ad</Button>
            </Wrapper>
        </WrapperFullWidth>
    )
}

const WrapperFullWidth = styled.div`
    width: 100%;
    background-color: var(--color-header);
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
    color: var(--color-background);
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
        color: var(--color-background);
        &:hover {
            color: var(--color-button-hover);
        }
    }
`

export default Header;