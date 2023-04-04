import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const PicsCarousel = ({picsArr}) => {
    return (
        <Carousel>
                <div>
                    <img src="/assets/red-shoes.jpg" />
                </div>
                <div>
                    <img src="/assets/red-shoes.jpg" />
                </div>
                <div>
                    <img src="/assets/red-shoes.jpg" />
                </div>
            </Carousel>
    )
}

export default PicsCarousel;