import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faClock,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import '../css/ActivityCard.css';

const ActivityCard = ({ 
  image, 
  title, 
  location, 
  duration, 
  price, 
  rating 
}) => {
  return (
    <div className="activity-card">
      <div className="activity-image-container">
        <img src={image} alt={title} className="activity-image" />
      </div>
      <div className="activity-content">
        <h3 className="activity-title">{title}</h3>
        <div className="activity-details">
          <span className="activity-location">
            <FontAwesomeIcon icon={faLocationDot} />
            {location}
          </span>
          <span className="activity-duration">
            <FontAwesomeIcon icon={faClock} />
            {duration}
          </span>
        </div>
        <div className="activity-footer">
          <span className="activity-price">${price}</span>
          <span className="activity-rating">
            <FontAwesomeIcon icon={faStar} />
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
};

ActivityCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired
};

export default ActivityCard;