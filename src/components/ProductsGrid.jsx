// src/components/ProductsGrid.jsx - Versión mejorada
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import ActivityCard from './ActivityCard';

const ProductsGrid = ({
  loading,
  dataLoaded,
  currentActivities,
  filteredActivities,
  itemsPerPage,
  totalPages,
  currentPage,
  handlePageChange,
  searchTerm
}) => {
  const navigate = useNavigate();

  return (
    <div className="products-grid">
      {loading && searchTerm && searchTerm.trim().length >= 2 ? (
        <p className="loading-message">Buscando "{searchTerm}"...</p>
      ) : !dataLoaded ? (
        <p className="loading-message">Esperando datos...</p>
      ) : currentActivities.length > 0 ? (
        <div className="activities-container">
          {currentActivities.map((activity) => (
            <div
              key={activity.id}
              className="activity-card-container"
              onClick={() => navigate(`/actividad/${activity.id}`)}
            >
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
          {searchTerm && searchTerm.trim().length >= 2 
            ? `No se encontraron actividades con el término "${searchTerm}".`
            : "No se encontraron actividades con los filtros seleccionados."}
        </p>
      )}

      {/* Paginación - solo mostrar si hay más de una página */}
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