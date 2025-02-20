import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faStar as faStarSolid,
  faSearch,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import BasicBreadcrumbs from '../components/BasicBreadcrumbs';
import ButtonGral from '../components/ButtonGral';
import '../css/ActivityDetail.css';
import ImageViewer from '../components/ImageViewer';

const ActivityDetail = () => {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  
  // Datos estáticos de ejemplo
  const activity = {
    id: 1,
    title: "Taller de Arte Urbano",
    city: "Buenos Aires",
    country: "Argentina",
    rating: 4.8,
    reviews: 15,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 55,
    images: [
      "/activity1-main.jpg",
      "/activity1-1.jpg",
      "/activity1-2.jpg",
      "/activity1-3.jpg",
    ]
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStarSolid : faStarRegular}
          className={i <= rating ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="activity-detail">
      <div className="detail-container">
        <BasicBreadcrumbs />
        
        <div className="images-section">
          <div className="main-image">
            <img src={activity.images[0]} alt={activity.title} />
          </div>
          <div className="side-images">
            {activity.images.slice(1).map((image, index) => (
              <div key={index} className={`side-image ${index === 2 ? 'with-overlay' : ''}`}>
                <img src={image} alt={`${activity.title} ${index + 1}`} />
                {index === 2 && (
                  <div 
                    className="view-more-overlay"
                    onClick={() => setShowImageViewer(true)}
                  >
                    <span className="view-more-text">
                      Ver más
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="detail-content">
            <h1 className="detail-title">
              {`${activity.title}, ${activity.city}`}
            </h1>
            
            <div className="location">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{`${activity.city}, ${activity.country}`}</span>
            </div>

            <div className="rating-section">
              <div className="stars">
                {renderRatingStars(activity.rating)}
                <span className="rating-number">{activity.rating}/5</span>
              </div>
              <a href="#reviews" className="reviews-link">
                {`${activity.reviews} reseñas`}
              </a>
            </div>

            <div className="description">
              <p className={expandedDescription ? 'expanded' : ''}>
                {activity.description}
              </p>
              <button 
                className="expand-button"
                onClick={() => setExpandedDescription(!expandedDescription)}
              >
                Ver más
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          </div>

          <div className="booking-card">
            <div className="price-info">
              <span className="price">${activity.price}</span>
              <span className="per-person">por persona</span>
              <p className="tax-info">
                El precio incluye impuestos y tarifas de reservación
              </p>
            </div>
            <ButtonGral
              text="Ver disponibilidad"
              color="blue"
            />
          </div>
        </div>
      </div>
      {showImageViewer && (
        <ImageViewer 
          images={activity.images}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default ActivityDetail;