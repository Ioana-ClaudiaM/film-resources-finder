import { slide1, slide2, slide3, slide4, slide5, slide6, useEffect, React, useState } from './Imports';
import '../Styles/Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    slide1,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6
  ];

  const totalImages = images.length;
  const extendedImages = [images[totalImages - 1], ...images, images[0]]; 

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (isTransitioning) {
      timeoutId = setTimeout(() => {
        setIsTransitioning(false);
        if (currentIndex === totalImages + 1) {
          setCurrentIndex(1);
        } else if (currentIndex === 0) {
          setCurrentIndex(totalImages);
        }
      }, 500); 
    }
    return () => clearTimeout(timeoutId);
  }, [currentIndex, isTransitioning, totalImages]);

  const handleTransitionEnd = () => {
    if (currentIndex === totalImages + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalImages);
    }
  };

  return (
    <div className="carousel">
      <div
        className="slides"
        style={{
          transform: `translateX(-${currentIndex * (100 / extendedImages.length)}%)`,
          transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} />
        ))}
      </div>
      <button
        className="prev-button"
        onClick={prevSlide}
      >
        &#10094;
      </button>
      <button
        className="next-button"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
