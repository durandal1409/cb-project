import styled from "styled-components";
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen';
import {fill} from "@cloudinary/url-gen/actions/resize";
import { AiOutlineDelete } from "react-icons/ai";


import Button from "../shared/Button";

const PicsUpload = ({formData, setFormData}) => {

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
                    console.log('Done! Here is the image info: ', result.info);
                    // setImages(prev => [...prev, result.info.public_id])
                    setFormData(prevState => ({
                        ...prevState,
                        pics: [...prevState.pics, result.info.public_id]
                    }))
                }
            }
        )
        myWidget.open();
    }

    const handleDeletePic = (picId) => {
        const updatedPicsArr = formData.pics.filter(pic => pic !== picId)
        setFormData({...formData, pics: updatedPicsArr});
    }

    return (
        <PicsUploadWrapper>
            <h4>Upload pictures</h4>
            <Button 
                type="button" 
                width="200px"
                handleClick={handleOpenWidget}
            >
                Upload
            </Button>
            <PicsPreview>
                {formData.pics.map(picId => {
                    {/* console.log("pic:  ", picId); */}
                    // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
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