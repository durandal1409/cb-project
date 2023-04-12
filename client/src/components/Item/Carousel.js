import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styled from "styled-components";

// component for showing ad pics in carousel
const PicsCarousel = ({picsArr}) => {
    return (
        <Carousel>
            {picsArr.map(pic => {
                return (
                    <ImgWrapper key={pic}>
                        <img src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/v1680735330/${pic}.jpg`} />
                    </ImgWrapper>
                )
            })}
        </Carousel>
    )
}

const ImgWrapper = styled.div`
    width: 100%;
    img {
        width: 100%;
        height: var(--big-block-width);
        object-fit: cover;
    }
`

export default PicsCarousel;