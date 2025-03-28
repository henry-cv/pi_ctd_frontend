// src/components/ActivityCard.jsx
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { FaMoneyCheck, FaSave } from "react-icons/fa";
import "../css/components/ActivityCard.css";
import DurationInfo from "./DurationInfo";
import { Link } from "react-router-dom";
import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import { useContextGlobal } from "../gContext/globalContext";

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
  fechaReserva,
}) => {
  // Imagen por defecto en caso de error o sin imagen
  const [extraCategories, setExtraCategories] = useState(false);
  const hasExtracategories = categories?.length > 1;
  const { state, dispatch } = useContextGlobal();
  const defaultImage = "/activitie.webp";
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleClick = () => {
    if (state.userFiltersTabs.activeTab === "reservations") {
      dispatch({
        type: "SET_ACTIVE_TAB_FILTER",
        payload: { activeTab: "edit-profile" },
      });
    }
  };

  return (
    <Link
      key={id}
      to={state.userFiltersTabs.activeTab === "reservations"
        ? `/mis-reservas/${id}`
        : `/actividad/${id}`}
      className="activity-link"
      onClick={handleClick}
    >
      <div className={`activity-card card-container-fluid ${state.userFiltersTabs.activeTab === "reservations" ? "card-height-reservation" : ""}`}>
        <div className="activity-image-container">
          <img
            src={image || defaultImage}
            alt={title}
            className="activity-image"
            onError={handleImageError}
          />

          {/* Botón de favoritos */}
          {state.userFiltersTabs.activeTab === "reservations" ? "" : <FavoriteButton productoId={id} />}
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

          {state.userFiltersTabs.activeTab === "reservations"
            ? <>
            <div className="booking-details-card">
            <p>{fechaReserva}</p>
            <span >
               ${price} Usd
               </span>

            </div>
  
            
   
            </> : <>
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
            </>}

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
  fechaReserva: PropTypes.string,
};

ActivityCard.defaultProps = {
  image: "/activitie.webp",
  duration: undefined,
  rating: 4.5,
};

export default ActivityCard;