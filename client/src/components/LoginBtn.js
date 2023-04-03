import { useAuth0 } from '@auth0/auth0-react';
import { AiOutlineUser } from "react-icons/ai";
import styled from "styled-components";

const LoginBtn = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <UserIcon onClick={() => loginWithRedirect()}>
                <AiOutlineUser size={'2rem'}/>
            </UserIcon>
        )
    )
}

const UserIcon = styled.button`
    border: none;
    background-color: transparent;
    cursor: pointer;
    svg {
        color: var(--color-button);
        &:hover {
            color: var(--color-button-hover);
        }
    }
`

export default LoginBtn;