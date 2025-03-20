// src/components/ActivityCard.jsx
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import "../css/components/ActivityCard.css";
import DurationInfo from "./DurationInfo";
import { Link } from "react-router-dom";
import { useState } from "react";
import FavoriteButton from "./FavoriteButton";

const ActivityCard = ({
  id,
  image,
  title,
  location,
  tipoEvento,
  horaInicio,
  horaFin,
  diasDisponible,
  duration,
  price,
  rating,
  categories,
}) => {
  // Imagen por defecto en caso de error o sin imagen
  const [extraCategories, setExtraCategories] = useState(false);
  const hasExtracategories = categories?.length > 1;
  const defaultImage = "/activitie.webp";
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <Link key={id} to={`/actividad/${id}`} className="activity-link">
      <div className="activity-card card-container-fluid">
        <div className="activity-image-container">
          {/* Botón de favoritos */}
          <FavoriteButton productoId={id} />
          
          <img
            src={image || defaultImage}
            alt={title}
            className="activity-image"
            onError={handleImageError}
          />
          <div className="container_card_category">
            {categories?.length > 0 && (
              <span className="card-category">{categories[0].nombre}</span>
            )}

            {hasExtracategories && (
              <span
                className="card-category"
                onMouseEnter={() => setExtraCategories(true)}
                onMouseLeave={() => setExtraCategories(false)}
              >
                {extraCategories
                  ? categories
                      .slice(1)
                      .map((cat) => cat.nombre)
                      .join(", ")
                  : `+${categories.length - 1}`}
              </span>
            )}
          </div>
        </div>
        <div className="activity-content">
          <h3 className="activity-title">{title}</h3>
          <div className="activity-details">
            <span className="activity-location">
              <FontAwesomeIcon icon={faMap} />
              {location}
            </span>
            <span className="activity-duration">
              {/* La duracion o el horario del evento depende del tipo de evento se manda a este componente DurationInfo para que maneje eso */}
              {tipoEvento === "FECHA_UNICA" ? (
                <FontAwesomeIcon icon={faClock} />
              ) : (
                <FontAwesomeIcon icon={faCalendarAlt} />
              )}
              <DurationInfo
                tipoEvento={tipoEvento}
                horaInicio={horaInicio}
                horaFin={horaFin}
                diasDisponible={diasDisponible}
              />
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
    </Link>
  );
};

ActivityCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  tipoEvento: PropTypes.string,
  horaInicio: PropTypes.string,
  horaFin: PropTypes.string,
  diasDisponible: PropTypes.array,
  duration: PropTypes.string,
  price: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  categories: PropTypes.array,
};

ActivityCard.defaultProps = {
  image: "/activitie.webp",
  duration: undefined,
  rating: 4.5,
};

export default ActivityCard;