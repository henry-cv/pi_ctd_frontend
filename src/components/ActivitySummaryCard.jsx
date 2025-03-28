import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useContextGlobal } from "../gContext/globalContext";
import "../css/components/ActivitySummaryCard.css";

const ActivitySummaryCard = ({ activity }) => {
  const { state } = useContextGlobal();
  
  // Obtener la primera imagen del producto si está disponible
  const defaultImage = "/activitie.webp";
  const activityImage = activity?.productoImagenesSalidaDto?.length > 0
    ? activity.productoImagenesSalidaDto[0].rutaImagen
    : defaultImage;

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  // Default rating to 4 if not provided
  const rating = activity.rating || 4;

  return (
    <div className={`activity-summary-card ${state.theme ? "dark" : ""}`}>
      <h3 className="card-title">La actividad</h3>
      
      <div className="activity-summary-main">
        <img
          src={activityImage}
          alt={activity.nombre}
          className="activity-thumbnail"
          onError={handleImageError}
        />
        
        <div className="activity-summary-details">
          <h2 className="activity-title">{activity.nombre}</h2>
          
          <div className="activity-location">
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <span>{activity.ciudad} - {activity.pais}</span>
          </div>
          
          <div className="activity-rating">
            {[1, 2, 3, 4].map((i) => (
              <FontAwesomeIcon key={i} icon={faStar} className="star-filled" />
            ))}
            <FontAwesomeIcon icon={faStarRegular} className="star-empty" />
            <span className="rating-text">{rating}/5</span>
          </div>
        </div>
      </div>
      
      <div className="activity-contact">
        <p className="contact-link">
          ¿Tienes dudas? <a href="#">Contacta al organizador</a>
        </p>
      </div>
    </div>
  );
};

export default ActivitySummaryCard;