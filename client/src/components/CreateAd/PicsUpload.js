import styled from "styled-components";
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import {fill} from "@cloudinary/url-gen/actions/resize";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";

import Button from "../shared/Button";

// this component responsible for uploading pics for the ad via Cloudinary
const PicsUpload = ({formData, setFormData}) => {

    const [loading, setLoading] = useState(false);

    // Create a Cloudinary instance
    const cld = new Cloudinary({
        cloud: {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
        }
    });

    // Create a Cloudinary upload widget and open it
    const handleOpenWidget = () => {
        var myWidget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, 
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}, (error, result) => { 
                if (!error && result && result.event === "success") { 
                    console.log('Done! Here is the image info: ', result.info);
                    // save Cloudinary public_id properties array  to state
                    // and then to db. They will be the sources for img in the ads.
                    setFormData(prevState => ({
                        ...prevState,
                        pics: [...prevState.pics, result.info.public_id]
                    }))
                }
                setLoading(false);
            }
        )
        myWidget.open();
    }

    const handlePicUploadClick = () => {
        setLoading(true);
        handleOpenWidget();
    }
    const handleDeletePic = (picId) => {
        const updatedPicsArr = formData.pics.filter(pic => pic !== picId)
        setFormData({...formData, pics: updatedPicsArr});
    }

    return (
        <PicsUploadWrapper>
            <h4>Upload pictures</h4>
            {loading 
                ?   <h3>Loading...</h3>
                :   <Button 
                        type="button" 
                        width="200px"
                        handleClick={() => handlePicUploadClick()}
                    >
                        Upload
                    </Button>
            }
            
            <PicsPreview>
                {formData.pics.map(picId => {
                    // Instantiate a CloudinaryImage object for the image 
                    // with the public_id property from Cloudinary as a source.
                    const myImage = cld.image(picId);
                    myImage.resize(fill().width(170).height(170));
                    return(
                        <PicWrapper key={picId}>
                            <button onClick={() => handleDeletePic(picId)}>
                                <AiOutlineDelete size={'1.5rem'}/>
                            </button>
                            <AdvancedImage cldImg={myImage} />
                        </PicWrapper>
                    )
                })}
            </PicsPreview>
        </PicsUploadWrapper>
    )
}

const PicsUploadWrapper = styled.div`

`
const PicsPreview = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    gap: 10px;
`
const PicWrapper = styled.div`
    position: relative;
    button {
        position: absolute;
        right: 2px;
        top: 2px;
        width: 26px;
        height: 26px;
        padding: 0;
        background-color: var(--color-background);
        border-radius: 12px;
        border: none;
        cursor: pointer;
        svg {
        color: var(--color-button);
        &:hover {
            color: var(--color-button-hover);
        }
    }
    }
`

export default PicsUpload;