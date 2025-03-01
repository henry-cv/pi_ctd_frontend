import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar as faStarSolid,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FaGlobe } from "react-icons/fa";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";
import ButtonGral from "../components/ButtonGral";
import "../css/pages/ActivityDetail.css";
import DurationInfo from "../components/DurationInfo";
import ImageViewer from "../components/ImageViewer";
import { useContextGlobal } from "../gContext/globalContext";

const ActivityDetail = () => {
  const { state } = useContextGlobal();
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const galleryRef = useRef(null);
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/producto/${id}`);

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Detalles del producto:", data);
        setActivity(data);
      } catch (error) {
        console.error("Error al obtener detalles:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [id]);

  // Detectar scroll para mostrar la card de reserva en móvil
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const galleryBottom = galleryRef.current.getBoundingClientRect().bottom;
        setShowMobileBooking(galleryBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar si estamos en vista móvil
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 576);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const handleOpenImageViewer = (index) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseImageViewer = () => {
    setShowImageViewer(false);
    document.body.style.overflow = 'auto';
  };

  const handleMobileImageNav = (direction) => {
    if (images.length <= 1) return;
    
    if (direction === 'prev') {
      setCurrentMobileImageIndex(prev => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else {
      setCurrentMobileImageIndex(prev => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} className="star half-filled" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="star" />);
      }
    }
    return stars;
  };

  // Placeholder para las imágenes en caso de error
  const defaultImage = "/activitie.webp";
  
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar la actividad</h2>
        <p>{error}</p>
        <ButtonGral text="Volver a intentar" onClick={() => window.location.reload()} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="error-container">
        <h2>Actividad no encontrada</h2>
        <p>La actividad que buscas no existe o ha sido eliminada.</p>
        <ButtonGral text="Volver al inicio" url="/" />
      </div>
    );
  }

  // Eliminamos la preparación de elementos para breadcrumbs
  
  const formatReviewText = (count) => {
    if (count === 1) return "1 reseña";
    return `${count} reseñas`;
  };

  // Preparar las imágenes 
  const images = activity.productoImagenesSalidaDto?.map(img => img.rutaImagen) || [];

  return (
    <div className="activity-detail-container">
      {/* Sección principal */}
      <main className="activity-main">
   
      <BasicBreadcrumbs />
        
        {/* Galería de imágenes */}
        <section className="gallery-section" ref={galleryRef}>
          <div className="content-wrapper">
            <div className="gallery-grid">
              <div 
                className="main-image" 
                onClick={() => !isMobileView && handleOpenImageViewer(0)}
              >
                <img 
                  src={isMobileView ? (images[currentMobileImageIndex] || defaultImage) : (images[0] || defaultImage)} 
                  alt={activity.nombre} 
                  onError={handleImageError}
                />
                
                
                {/* Botones de navegación para móvil */}
                {isMobileView && images.length > 1 && (
                  <>
                    <button 
                      className="mobile-gallery-nav prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobileImageNav('prev');
                      }}
                      aria-label="Imagen anterior"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button 
                      className="mobile-gallery-nav next"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobileImageNav('next');
                      }}
                      aria-label="Imagen siguiente"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </>
                )}
              </div>
              <div className="thumbnail-grid">
                {/* Renderizamos las imágenes disponibles primero */}
                {images.slice(1, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === 3 && images.length > 5 ? 'with-overlay' : ''}`}
                    onClick={() => handleOpenImageViewer(index + 1)}
                  >
                    <img 
                      src={image} 
                      alt={`${activity.nombre} - imagen ${index + 1}`} 
                      onError={handleImageError}
                    />
                    {index === 3 && images.length > 5 && (
                      <div className="more-images-overlay">
                        <span>+{images.length - 5}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Añadimos contenedores vacíos si no hay 4 imágenes en la columna */}
                {/* {[...Array(Math.max(0, 4 - images.slice(1, 5).length))].map((_, index) => (
                  <div 
                    key={`empty-${index}`}
                    className={`thumbnail empty ${state.theme || ''}`}
                  ></div>
                ))} */}
              </div>
            </div>
          </div>
        </section>

        {/* Información del producto */}
        <section className="detail-section">
          <div className="content-wrapper">
            <div className="detail-grid">
              {/* Columna izquierda: detalles principales */}
              <div className="detail-column">
                <div className="location-title">
                  <h1>{activity.nombre}</h1>
                  <div className="location-info">
                    <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
                    <span>{activity.ubicacion?.ciudad || "Ciudad"}, {activity.ubicacion?.pais || "País"}</span>
                  </div>
                </div>

                <div className="rating-section">
                  <div className="stars-container">
                    {renderStarRating(activity.calificacion || 4.5)}
                    <span className="rating-value">({activity.calificacion || 4.5}/5)</span>
                  </div>
                  <Link to="#reviews" className="reviews-link">
                    {formatReviewText(activity.numeroReseñas || 5)}
                  </Link>
                </div>

                <div className="description-section">
                  <p className={expandedDescription ? "expanded" : ""}>
                    {activity.descripcion}
                  </p>
                  {activity.descripcion && activity.descripcion.length > 200 && (
                    <button 
                      className="expand-button"
                      onClick={() => setExpandedDescription(!expandedDescription)}
                    >
                      {expandedDescription ? 'Ver menos' : 'Ver más'}
                      <FontAwesomeIcon icon={expandedDescription ? faChevronUp : faChevronDown} />
                    </button>
                  )}
                </div>

                <div className="experience-section">
                  <h2>Sobre la experiencia</h2>

                  <div className="info-card yellow">
                    <div className="info-item">
                      <FontAwesomeIcon icon={faCalendarCheck} className="info-icon" />
                      <p>
                        <strong>Cancelación gratis</strong> hasta 24 horas antes de la experiencia (hora local)
                      </p>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faCalendarCheck} className="info-icon" />
                      <p>
                        <strong>Reserva ahora paga después</strong> planes flexibles aseguran tu reserva, sin que se te haga el cargo hoy.
                      </p>
                    </div>
                  </div>

                  <div className="experience-details">
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faClock} className="detail-icon" />
                      <div>
                        <h3>Duración</h3>
                        <p>
                          <DurationInfo
                            tipoEvento={activity.tipoEvento} 
                            horaInicio={activity.horaInicio} 
                            horaFin={activity.horaFin} 
                            diasDisponible={activity.diasDisponible}
                          />
                        </p>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FaGlobe className="detail-icon" />
                      <div>
                        <h3>Idioma</h3>
                        <p>{activity.idioma || "Español"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: booking card */}
              <div className="booking-column">
                <div className="booking-card">
                  <div className="price-section">
                    <span className="price">${activity.valorTarifa || 0}</span>
                    <span className="price-type">
                      {activity.tipoTarifa === "POR_PERSONA" ? "por persona" : 
                       activity.tipoTarifa === "POR_PAREJA" ? "por pareja" : 
                       activity.tipoTarifa === "POR_GRUPO_6" ? "por grupo (6 personas)" : 
                       activity.tipoTarifa === "POR_GRUPO_10" ? "por grupo (10 personas)" : ""}
                    </span>
                    <p className="price-note">(el precio incluye impuestos y tarifas de reservación)</p>
                  </div>
                  <ButtonGral 
                    text="Ver disponibilidad"
                    variant="primary"
                    color="blue"
                    fullWidth={true}
                    url={`/reserva/${activity.id}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile booking card flotante */}
      {showMobileBooking && (
        <div className="mobile-booking-card">
          <div className="mobile-price">
            <span className="price">${activity.valorTarifa || 0}</span>
            <span className="price-type">{activity.tipoTarifa === "POR_PERSONA" ? "por persona" : "por grupo"}</span>
          </div>
          <ButtonGral 
            text="Ver disponibilidad"
            variant="primary"
            color="blue"
            fullWidth={true}
            url={`/reserva/${activity.id}`}
          />
        </div>
      )}

      {/* Visor de imágenes */}
      {showImageViewer && !isMobileView && (
        <ImageViewer
          images={images}
          currentIndex={currentImageIndex}
          onClose={handleCloseImageViewer}
        />
      )}
    </div>
  );
};

export default ActivityDetail;