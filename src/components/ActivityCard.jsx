// src/components/ActivityCard.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faMap,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import { FaMoneyCheck, FaSave } from "react-icons/fa";
import "../css/components/ActivityCard.css";
import DurationInfo from "./DurationInfo";
import { Link } from "react-router-dom";
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
  estado,
}) => {
  // Estado para almacenar la calificación real obtenida de la API
  const [realRating, setRealRating] = useState(rating || 0);
  
  // Efecto para cargar la calificación real desde la API
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/reserva/resenas/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.promedioPuntuacion === 'number') {
            setRealRating(data.promedioPuntuacion);
          } else {
            setRealRating(0); // Si no hay calificación, mostrar 0
          }
        }
      } catch (error) {
        console.error("Error al cargar calificación:", error);
        // Si falla la carga, usamos el valor por defecto o 0
        setRealRating(rating || 0);
      }
    };
    
    // Solo cargar calificación si estamos en la vista normal (no en reservas)
    if (id && !estado) {
      fetchRating();
    }
  }, [id, rating, estado]);

  // Imagen por defecto en caso de error o sin imagen
  const [extraCategories, setExtraCategories] = useState(false);
  const hasExtracategories = categories?.length > 1;
  const { state, dispatch } = useContextGlobal();
  const defaultImage = "/activitie.webp";
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  const handleClick = () => {
    
    dispatch({
      type: "SET_BOOKINGS_DATES", 
      payload: { callEffect: true },
    });

    dispatch({
      type: "SET_URL_REDIRECTION",
      payload: "",
      });

    // if (state.userFiltersTabs.activeTab === "reservations") {
    //   dispatch({
    //     type: "SET_ACTIVE_TAB_FILTER",
    //     payload: { activeTab: "edit-profile" },
    //   });
    // }
  };

  // console.log(state.bookingModals.callEffect);

  return (
    <Link
      key={id}
      to={state.userFiltersTabs.activeTab === "reservations"
        ? `/perfil/misreservas/${id}`
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
          <h3 className="activity-title-ca">{title}</h3>

          {state.userFiltersTabs.activeTab === "reservations"
            ? <>
            <p className="booking-state">{estado}</p>
            <div className="booking-details-card">
            <p>{fechaReserva}</p>
            <span >
               ${price} Usd
               </span>

            </div>
  
            
   
            </> : <>
              <div className="activity-details">
                <span className="activity-location-card">
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
                <span className="activity-price">${price} </span>
                <span className="activity-rating">
                  <FontAwesomeIcon 
                    icon={realRating > 0 ? faStarSolid : faStarRegular} 
                    className={realRating > 0 ? "star-filled" : "star-empty"} 
                  />
                  {realRating > 0 ? realRating.toFixed(1) : "0"}
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
  estado:PropTypes.string,
};

ActivityCard.defaultProps = {
  image: "/activitie.webp",
  duration: undefined,
  rating: 4.5,
};

export default ActivityCard;