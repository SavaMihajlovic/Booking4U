import React, { useState } from 'react';
import { Image, IconButton } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    console.log(images);

    const goToNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <>
            <Image 
                src={`data:image/jpeg;base64,${images[currentIndex]}`} 
                alt={`Image ${currentIndex + 1}`} 
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover"
                }}
            />

            <IconButton
                aria-label="Previous Image"
                onClick={goToPrevImage}
                position="absolute"
                top="50%"
                left="10px"
                transform="translateY(-50%)"
                zIndex="1"
                backgroundColor='transparent'
            > 
                <FaChevronLeft/>
            </IconButton>

            <IconButton
                aria-label="Next Image"
                onClick={goToNextImage}
                position="absolute"
                top="50%"
                right="10px"
                transform="translateY(-50%)"
                zIndex="1"
                backgroundColor='transparent'
            > 
                <FaChevronRight />
            </IconButton>
        </>
    );
};

export default ImageCarousel;
