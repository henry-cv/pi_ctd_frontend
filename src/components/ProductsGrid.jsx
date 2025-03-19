import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import ActivityCard from './ActivityCard'; // Importar el componente existente

const ProductsGrid = ({
  loading,
  dataLoaded,
  currentActivities,
  filteredActivities,
  itemsPerPage,
  totalPages,
  currentPage,
  handlePageChange
}) => {
  const navigate = useNavigate();

  // Imagen por defecto en caso de error o sin imagen
  const defaultImage = "/activitie.webp";
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="products-grid">
      {loading || !dataLoaded ? (
        <p className="loading-message">Cargando actividades...</p>
      ) : currentActivities.length > 0 ? (
        <div className="activities-container">
          {currentActivities.map((activity) => (
            <div
              key={activity.id}
              className="activity-card-container"
              onClick={() => navigate(`/actividad/${activity.id}`)}
            >
              {/* Usando el componente ActivityCard existente */}
              <ActivityCard
                id={activity.id}
                image={
                  activity.productoImagenesSalidaDto?.[0]?.rutaImagen ||
                  "/activitie.webp"
                }
                title={activity.nombre}
                location={activity.direccion || "Ubicación no disponible"}
                tipoEvento={activity.tipoEvento}
                horaInicio={activity.horaInicio}
                horaFin={activity.horaFin}
                diasDisponible={activity.diasDisponible}
                duration={activity.duracion}
                price={activity.valorTarifa}
                rating={activity.puntuacion || 4.5}
                categories={activity.categorias}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">
          No se encontraron actividades con los filtros seleccionados.
        </p>
      )}

      {/* Paginación */}
      {filteredActivities.length > itemsPerPage && (
        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="circular"
            className="custom-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;