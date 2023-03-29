import styled from "styled-components";
import { Link } from "react-router-dom";

const SmallItem = ({name, price, address, picSrc}) => {
    return (
        <Wrapper>
            <img src={picSrc} alt={name}/>
            <h4>{name}</h4>
            <span>${price}</span>
            <p>{address}</p>
        </Wrapper>
    )
}

const Wrapper = styled(Link)`
    width: 200px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0px 0px 24px -10px #000000;
    text-decoration: none;
    margin-bottom: 20px;
    img {
        width: 180px;
        height: auto;
        border-radius: 5px;
        margin: 10px;
    }
    h4 {
        font-size: 1.2rem;
        padding: 10px;
        background-color: var(--color-tertiary);
    }
    span {
        font-weight: bold;
        margin: 10px;
    }
    p {
        margin: 0 10px 10px 10px;
    }
`

export default SmallItem;