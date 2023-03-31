import styled from "styled-components";
import { Link } from "react-router-dom";

const SmallItem = ({name, price, address, picSrc, _id}) => {
    return (
        <Wrapper to={`/item/${_id}`}>
            <img src={picSrc} alt={name}/>
            <h4>{name}</h4>
            <span>${price}</span>
            <p>{address}</p>
        </Wrapper>
    )
}

const Wrapper = styled(Link)`
    width: 190px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    text-decoration: none;
    margin-bottom: 20px;
    transition: 0.3s all;
    background-color: #fff;
    &:hover {
        transform: scale(1.03);
    }
    img {
        width: 170px;
        height: auto;
        border-radius: 5px;
        margin: 10px;
    }
    h4 {
        font-size: 1.2rem;
        padding: 10px;
        /* background-color: var(--color-tertiary); */
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