import { useAuth0 } from '@auth0/auth0-react';
import { Link } from "react-router-dom";
import styled from "styled-components";

const User = () => {
    const { user, logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <Wrapper>
                <AnchorName to={"/profile"}>
                    {user.given_name}
                </AnchorName>
                <Dropdown>
                    <li>
                        <AnchorOption to={"/profile"}>
                            My profile
                        </AnchorOption>
                    </li>
                    <li>
                        <AnchorOption to={"/profile"}>
                            My favourites
                        </AnchorOption>
                    </li>
                    <li>
                        <button onClick={() => logout()}>
                            SignOut
                        </button>
                    </li>
                </Dropdown>
            </Wrapper>
        )
    )
}

const Wrapper = styled.div`
    position: relative;
    padding-top: 9px;
    z-index: 2;
`
const Dropdown = styled.ul`
    position: absolute;
    top: 34px;
    width: 130px;
    background-color: #fff;
    border-radius: 7px;
    -webkit-box-shadow: 0px 1px 7px -1px #000000; 
    box-shadow: 0px 1px 7px -1px #000000;
    display: none;
    li {
        padding: 10px;
        button {
            cursor: pointer;
            background-color: transparent;
            border: none;
            padding: 0;
            font-size: 1rem;
            &:hover {
                color: var(--color-button-hover);
            }
        }
        
    }
    ${Wrapper}:hover & {
        display: block;
    }
`
const AnchorName = styled(Link)`
    text-decoration: none;
    cursor: pointer;
    padding-left: 10px;
    font-size: 1.3rem;
    &:hover {
        color: var(--color-button-hover);
    }
`
const AnchorOption = styled(Link)`
    text-decoration: none;
    cursor: pointer;
    &:hover {
        color: var(--color-button-hover);
    }
`

export default User;