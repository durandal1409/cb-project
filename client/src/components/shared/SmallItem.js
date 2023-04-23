import styled from "styled-components";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useEffect, useContext } from "react";
// import { AdvancedImage } from '@cloudinary/react'
// import { Cloudinary } from '@cloudinary/url-gen';
// import {thumbnail} from "@cloudinary/url-gen/actions/resize";
// import {fill} from "@cloudinary/url-gen/actions/resize";

import { UserContext } from "../UserContext";

// small ad component with main ad info
// (it shows up on almost every page)
const SmallItem = ({name, price, address, picSrc, _id}) => {
    const { userData, setUserData } = useContext(UserContext);
    // // Create a Cloudinary instance
    // const cld = new Cloudinary({
    //     cloud: {
    //     cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    //     }
    // });
    // // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
    // const myImage = cld.image(picSrc);
    // myImage.resize(thumbnail().width(150).height(150))

    const handleLike = (e, adId) => {
        e.preventDefault();
        e.stopPropagation();
        fetch(`${process.env.REACT_APP_BASE_URL}/api/users/${userData._id}/${_id}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setUserData({...userData, favourites: data.data.favourites});
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
    }
    
    return (
        <Wrapper to={`/item/${_id}`}>
            <button onClick={(e) => handleLike(e, _id)}>
                <AiOutlineHeart size={'2rem'} className={userData?.favourites.find(el => el === _id) ? 'favourite' : null}/>
            </button>
            <img src={`https://res.cloudinary.com/dgll9gjpk/image/upload/v1680735330/${picSrc}.jpg`} />
            <h4>{name}</h4>
            <span>${price}</span>
            <p>{address}</p>
        </Wrapper>
    )
}

const Wrapper = styled(Link)`
    position: relative;
    width: 190px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    text-decoration: none;
    margin-bottom: 20px;
    transition: 0.3s all;
    background-color: var(--color-background-white);
    &:hover {
        /* transform: scale(1.03); */
        background-color: var(--color-background-dark);
        h4 {
            text-decoration: underline;
        }
    }
    img {
        width: 170px;
        height: 170px;
        object-fit: cover;
        border-radius: 5px;
        margin: 10px;
    }
    h4 {
        font-size: 1.2rem;
        padding: 10px;
    }
    span {
        font-weight: bold;
        margin: 10px;
    }
    p {
        margin: 0 10px 10px 10px;
    }
    button {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 32px;
        height: 31px;
        padding: 0px;
        background-color: rgba(255,255,255,0.7);
        border-radius: 5px;
        border: none;
        cursor: pointer;
        svg {
            color: var(--color-button);
            &.favourite {
                color: var(--color-button-hover);
            }
        }
    }
`

export default SmallItem;