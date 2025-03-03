import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../css/components/ImageViewer.css";

const ImageViewer = ({ images, currentIndex = 0, onClose }) => {
  const [index, setIndex] = useState(currentIndex);
  const [loaded, setLoaded] = useState(false);
  
  // Resetear el estado de carga cuando cambia el índice
  useEffect(() => {
    setLoaded(false);
  }, [index]);

  // Precargar las imágenes para una experiencia más fluida
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
  }, [images]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (idx) => {
    setIndex(idx);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/activitie.webp"; // Imagen por defecto
  };

  // Función para manejar swipe en móviles
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e) => {
      if (!e.touches.length) return;
      const moveX = e.touches[0].clientX;
      const diff = startX - moveX;
      
      // Solo cambiamos la imagen si el movimiento es significativo
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, { once: true });
  };

  return (
    <div 
      className="image-viewer-overlay"
      tabIndex="0" 
      onKeyDown={handleKeyDown}
    >
      <div className="image-viewer-container">
        <button className="close-button" onClick={onClose} aria-label="Cerrar">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div 
          className="main-viewer-section"
          onTouchStart={handleTouchStart}
        >
          <button 
            className="nav-button prev" 
            onClick={handlePrev} 
            aria-label="Imagen anterior"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          
          <div className="main-image-container">
            <div className={`image-loader ${loaded ? 'hidden' : ''}`}>
              <div className="spinner"></div>
            </div>
            <img
              src={images[index]}
              alt={`Vista ampliada ${index + 1}`}
              className={`main-viewer-image ${loaded ? 'visible' : ''}`}
              onLoad={() => setLoaded(true)}
              onError={handleImageError}
            />
          </div>
          
          <button 
            className="nav-button next" 
            onClick={handleNext} 
            aria-label="Imagen siguiente"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        
        <div className="image-counter">
          {index + 1} / {images.length}
        </div>
        
        <div className="thumbnails-container">
          <div className="thumbnails-wrapper">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail-item ${idx === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(idx)}
              >
                <img 
                  src={img} 
                  alt={`Miniatura ${idx + 1}`} 
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default ImageViewer;