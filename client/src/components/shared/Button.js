import styled from "styled-components";

const Button = ({children, type}) => {
    return (
        <StyledButton type={type}>{children}</StyledButton>
    )
}

const StyledButton = styled.button`
    background-color: var(--color-button);
    width: 100px;
    height: 35px;
    border-radius: 7px;
    border: none;
    color: var(--color-background);
    cursor: pointer;
    &:hover {
        background-color: var(--color-button-hover);
    }
`
export default Button;
