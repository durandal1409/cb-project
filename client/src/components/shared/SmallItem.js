import styled from "styled-components";
import { Link } from "react-router-dom";
// import { AdvancedImage } from '@cloudinary/react'
// import { Cloudinary } from '@cloudinary/url-gen';
// import {thumbnail} from "@cloudinary/url-gen/actions/resize";
// import {fill} from "@cloudinary/url-gen/actions/resize";

const SmallItem = ({name, price, address, picSrc, _id}) => {

    // // Create a Cloudinary instance
    // const cld = new Cloudinary({
    //     cloud: {
    //     cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    //     }
    // });
    // // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
    // const myImage = cld.image(picSrc);
    // myImage.resize(thumbnail().width(150).height(150))

    return (
        <Wrapper to={`/item/${_id}`}>
            <img src={`https://res.cloudinary.com/dgll9gjpk/image/upload/v1680735330/${picSrc}.jpg`} />
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
        height: 170px;
        object-fit: cover;
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