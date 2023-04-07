import styled from "styled-components";
import { useState } from "react";
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import {fill} from "@cloudinary/url-gen/actions/resize";


import Button from "../shared/Button";

const PicsUpload = ({images, setImages, setFormData}) => {
    // TODO:
    // do I still need images state here and in CreatAd?

    // Create a Cloudinary instance
    const cld = new Cloudinary({
        cloud: {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
        }
    });

    const handleOpenWidget = () => {
        // Create a Cloudinary upload widgert and open it
        var myWidget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, 
            uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}, (error, result) => { 
                if (!error && result && result.event === "success") { 
                    // console.log('Done! Here is the image info: ', result.info);
                    setImages(prev => [...prev, result.info.public_id])
                    setFormData(prevState => ({
                        ...prevState,
                        pics: [...prevState.pics, result.info.public_id]
                    }))
                }
            }
        )
        myWidget.open();
    }

    return (
        <PicsUploadWrapper>
            <h3>Upload pictires</h3>
            <Button 
                type="button" 
                width="200px"
                handleClick={handleOpenWidget}
            >
                Upload
            </Button>
            <PicsPreview>
                {images.map(picId => {
                    // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
                    const myImage = cld.image(picId);
                    myImage.resize(fill().width(170).height(170));
                    return(
                        <div key={picId}>
                            <AdvancedImage  cldImg={myImage} />
                        </div>
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
`

export default PicsUpload;