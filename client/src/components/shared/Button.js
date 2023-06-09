import styled from "styled-components";

const Button = ({children, type, width, handleClick, className}) => {
    return (
        <StyledButton 
            type={type} 
            width={width} 
            onClick={handleClick}
            className={className}
        >
            {children}
        </StyledButton>
    )
}

const StyledButton = styled.button`
    background-color: var(--color-button);
    width: ${props => props.width ?? "100px"};
    height: 35px;
    border-radius: 7px;
    border: none;
    color: var(--color-background);
    cursor: pointer;
    &.hide {
        display: none;
    }
    &:hover {
        background-color: var(--color-button-hover);
    }
`
export default Button;
