import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styled from "styled-components";

const PicsCarousel = ({picsArr}) => {
    return (
        <Carousel>
            {picsArr.map(pic => {
                return (
                    <ImgWrapper key={pic}>
                        <img src={`https://res.cloudinary.com/dgll9gjpk/image/upload/v1680735330/${pic}.jpg`} />
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