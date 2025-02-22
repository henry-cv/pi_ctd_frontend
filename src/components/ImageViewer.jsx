import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faChevronLeft, 
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import '../css/ImageViewer.css';

const ImageViewer = ({ images, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="image-viewer-overlay">
      <div className="image-viewer-content">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="main-image-container">
          <img 
            src={images[currentImageIndex]} 
            alt={`Vista ${currentImageIndex + 1}`} 
            className="main-viewer-image"
          />
        </div>

        <div className="thumbnails-container">
          <button 
            className="nav-button prev"
            onClick={handlePrevious}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="thumbnails-scroll">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={image} alt={`Miniatura ${index + 1}`} />
              </div>
            ))}
          </div>

          <button 
            className="nav-button next"
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired
};

export default ImageViewer;