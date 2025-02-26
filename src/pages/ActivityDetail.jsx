import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import '../css/pages/ActivityDetail.css';
import ImageViewer from '../components/ImageViewer';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  // Imagen por defecto en caso de error
  const defaultImage = '/activitie.webp';
  
  // Manejar errores de carga de imágenes
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  if (loading) return <p className="loading-message">Cargando detalles...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!activity) return <p className="not-found-message">No se encontraron detalles para esta actividad.</p>;

  return (
    <div className="activity-detail">
      <div className="detail-container">
        <BasicBreadcrumbs />
        
        {/* Sección de imágenes */}
        {activity.productoImagenesSalidaDto && activity.productoImagenesSalidaDto.length > 0 ? (
          <div className="images-section">
            <div className="main-image">
              <img 
                src={activity.productoImagenesSalidaDto[0].rutaImagen} 
                alt={activity.nombre}
                onError={handleImageError}
              />
            </div>
            <div className="side-images">
              {activity.productoImagenesSalidaDto.slice(1, 4).map((imagen, index) => (
                <div 
                  key={index} 
                  className={`side-image ${index === 2 && activity.productoImagenesSalidaDto.length > 4 ? 'with-overlay' : ''}`}
                >
                  <img 
                    src={imagen.rutaImagen} 
                    alt={`${activity.nombre} ${index + 1}`}
                    onError={handleImageError}
                  />
                  {index === 2 && activity.productoImagenesSalidaDto.length > 4 && (
                    <div 
                      className="view-more-overlay"
                      onClick={() => setShowImageViewer(true)}
                    >
                      <span className="view-more-text">
                        Ver más (+{activity.productoImagenesSalidaDto.length - 4})
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="images-section">
            <div className="main-image">
              <img src={defaultImage} alt={activity.nombre} />
            </div>
          </div>
        )}

        <div className="content-section">
          <div className="detail-content">
            <h1 className="detail-title">{activity.nombre}</h1>
            
            <div className="activity-meta">
              {/* Si tienes información de ubicación */}
              {activity.direccion && (
                <div className="location">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{activity.direccion}</span>
                </div>
              )}
              
              {/* Información de horario */}
              <div className="schedule-info">
                <span>Horario: {activity.horaInicio} - {activity.horaFin}</span>
              </div>
              
              {/* Información de tipo de evento */}
              <div className="event-type">
                <span>Tipo: {activity.tipoEvento === 'FECHA_UNICA' ? 'Fecha única' : 'Recurrente'}</span>
              </div>
              
              {/* Fechas específicas o días disponibles */}
              {activity.tipoEvento === 'FECHA_UNICA' && activity.fechaEvento && (
                <div className="event-date">
                  <span>Fecha: {new Date(activity.fechaEvento).toLocaleDateString()}</span>
                </div>
              )}
              
              {activity.tipoEvento === 'RECURRENTE' && activity.diasDisponible && activity.diasDisponible.length > 0 && (
                <div className="available-days">
                  <span>Días disponibles: {activity.diasDisponible.join(', ')}</span>
                </div>
              )}
              
              {/* Idioma */}
              <div className="language">
                <span>Idioma: {activity.idioma}</span>
              </div>
            </div>

            {/* Calificación estática por ahora - puede ser implementada más adelante */}
            <div className="rating-section">
              <div className="stars">
                {renderRatingStars(4.5)}
                <span className="rating-number">4.5/5</span>
              </div>
            </div>

            <div className="description">
              <p className={expandedDescription ? 'expanded' : ''}>
                {activity.descripcion}
              </p>
              {activity.descripcion.length > 150 && (
                <button 
                  className="expand-button"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                >
                  {expandedDescription ? 'Ver menos' : 'Ver más'}
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={expandedDescription ? 'rotated' : ''}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="booking-card">
            <div className="price-info">
              <span className="price">${activity.valorTarifa}</span>
              <span className="per-person">
                {activity.tipoTarifa === 'POR_PERSONA' ? 'por persona' : 
                  activity.tipoTarifa === 'POR_PAREJA' ? 'por pareja' :
                  activity.tipoTarifa === 'POR_GRUPO_6' ? 'por grupo (6 personas)' :
                  activity.tipoTarifa === 'POR_GRUPO_10' ? 'por grupo (10 personas)' : ''}
              </span>
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
      
      {/* Visor de imágenes en pantalla completa */}
      {showImageViewer && activity.productoImagenesSalidaDto && (
        <ImageViewer 
          images={activity.productoImagenesSalidaDto.map(img => img.rutaImagen)}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default ActivityDetail;