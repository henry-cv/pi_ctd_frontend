import React, { useState, useEffect, useRef } from "react";
import { Button, Backdrop } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "../styles/Reviews.css";
import { useContextGlobal } from "../gContext/globalContext";
import ReviewModal from "./ReviewModal";
import ReviewStats from "./ReviewStats";
import ReviewItem from "./ReviewItem";
import ReviewFilters from "./ReviewFilters";
import ReviewFilterSidebar from "./ReviewFilterSidebar";
import { useReviews } from "../hooks/useReviews";
import { useReviewForm } from "../hooks/useReviewForm";
import { gsap } from "gsap";

const Reviews = ({ productoId }) => {
    const { state } = useContextGlobal();
    const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const reviewsContainerRef = useRef(null);
    const sidebarRef = useRef(null);

    // Estado para filtros de calificación
    const [ratingFilters, setRatingFilters] = useState({
        five: false,
        four: false,
        three: false,
        two: false,
        one: false
    });
    
    const [filteredReviews, setFilteredReviews] = useState([]);

    // Usar los hooks personalizados
    const {
        reviews: sortedReviews,
        loading,
        error,
        ratingStats,
        sortBy,
        setSortBy,
        canReview,
        reservaId,
        submitReview,
        userHasReviewed,
    } = useReviews(productoId);

    const {
        isModalOpen,
        newReview,
        isSubmitting,
        submitError,
        handleOpenModal,
        handleCloseModal,
        handleReviewChange,
        handleRatingChange,
        handleSubmitReview,
    } = useReviewForm(submitReview, reservaId);

    // Detectar si estamos en mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Efecto para manejar las animaciones con GSAP
    useEffect(() => {
        if (!isMobile && reviewsContainerRef.current && sidebarRef.current) {
            console.log("Animation triggered with filterSidebarOpen:", filterSidebarOpen);
            
            // Configuraciones básicas
            gsap.config({ nullTargetWarn: false });
            
            gsap.defaults({
                ease: "power2.out",
                duration: 0.18,
                overwrite: true
            });
            
            // Detener animaciones en curso
            gsap.killTweensOf([reviewsContainerRef.current, sidebarRef.current]);
            
            if (filterSidebarOpen) {
                // Hacer visible el sidebar con tamaño constante
                gsap.set(sidebarRef.current, { 
                    visibility: "visible",
                    display: "block",
                    opacity: 0,
                    // Asegurar que mantenga su altura
                    height: "auto",
                    minHeight: "450px"
                });
                
                // Animar solo el contenedor de reviews
                gsap.to(reviewsContainerRef.current, {
                    transform: "translateX(280px)",
                    duration: 0.18,
                    // Asegurar que tenga altura suficiente
                    minHeight: "450px"
                });
                
                // Animar la aparición del sidebar
                gsap.to(sidebarRef.current, {
                    opacity: 1,
                    duration: 0.15
                });
                
            } else {
                // Animar la desaparición manteniendo el tamaño
                gsap.to(sidebarRef.current, {
                    opacity: 0,
                    duration: 0.15,
                    onComplete: () => {
                        gsap.set(sidebarRef.current, { 
                            visibility: "hidden",
                            display: "none"
                        });
                    }
                });
                
                // Animar el regreso del contenedor
                gsap.to(reviewsContainerRef.current, {
                    transform: "translateX(0)",
                    duration: 0.18
                });
            }
        }
    }, [filterSidebarOpen, isMobile]);

    // Actualizar las reseñas filtradas cuando cambien las reseñas originales o los filtros
    useEffect(() => {
        const hasActiveFilters = Object.values(ratingFilters).some(Boolean);
        
        if (!hasActiveFilters) {
            setFilteredReviews(sortedReviews);
            return;
        }
        
        const filtered = sortedReviews.filter(review => {
            const rating = review.puntuacion;
            return (
                (ratingFilters.five && rating === 5) ||
                (ratingFilters.four && rating === 4) ||
                (ratingFilters.three && rating === 3) ||
                (ratingFilters.two && rating === 2) ||
                (ratingFilters.one && rating === 1)
            );
        });
        
        setFilteredReviews(filtered);
    }, [sortedReviews, ratingFilters]);

    // Solo para depuración - monitorear cambios en filterSidebarOpen
    useEffect(() => {
        console.log("filterSidebarOpen changed to:", filterSidebarOpen);
    }, [filterSidebarOpen]);

    // Manejador para alternar el sidebar de filtros
    const toggleFilterSidebar = () => {
        // Usando una función para prevenir problemas con cierres léxicos
        setFilterSidebarOpen(currentState => {
            const newState = !currentState;
            console.log("Setting sidebar state to:", newState);
            return newState;
        });
    };
    
    // Manejador para cambiar filtros de calificación
    const handleRatingFilterChange = (filterName) => {
        setRatingFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };
    
    // Aplicar filtros (para el botón Aplicar)
    const handleApplyFilters = () => {
        if (isMobile) {
            setFilterSidebarOpen(false);
        }
    };
    
    // Resetear filtros
    const handleResetFilters = () => {
        setRatingFilters({
            five: false,
            four: false,
            three: false,
            two: false,
            one: false
        });
    };

    // Función para generar el mensaje del tooltip según el estado
    const getButtonTooltip = () => {
        if (!state.user) return "Inicia sesión para escribir una opinión";
        if (userHasReviewed) return "Ya has escrito una reseña para esta actividad";
        if (!canReview)
            return "Solo puedes escribir una reseña si has reservado esta actividad";
        return "Escribe tu opinión sobre esta actividad";
    };

    // Modificar la lógica del botón (para ambas secciones - con y sin reseñas)
    const renderReviewButton = () => (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleOpenModal(canReview && !userHasReviewed, state.user)}
            disabled={!canReview || !state.user || userHasReviewed}
            title={getButtonTooltip()}
            sx={{
                borderRadius: "30px",
                textTransform: "none",
                backgroundColor: "#6749D9",
                padding: "10px 20px",
                "&.Mui-disabled": {
                    backgroundColor: "#9E9E9E",
                    color: "white",
                },
            }}
        >
            {userHasReviewed ? "Ya opinaste" : "Escribir una opinión"}
        </Button>
    );

    // Estados de carga y error
    if (loading) {
        return (
            <section className="reviews-section">
                <h2>Reseñas</h2>
                <p className="loading-reviews">Cargando opiniones...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="reviews-section">
                <h2>Reseñas</h2>
                <p className="error-reviews">Error al cargar opiniones: {error}</p>
            </section>
        );
    }

    // Caso sin reseñas
    if (!sortedReviews || !sortedReviews.length) {
        return (
            <section id="reviews" className="reviews-section">
                <h2>Reseñas</h2>
                <p className="no-reviews-message">
                    Esta actividad no cuenta con opiniones disponibles.
                </p>

                <div className="reviews-actions" style={{ marginTop: "20px" }}>
                    {renderReviewButton()}

                    {userHasReviewed && (
                        <p className="review-info-message">
                            Ya has dejado tu opinión sobre esta actividad.
                        </p>
                    )}

                    <ReviewModal
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        userData={state.user}
                        review={newReview}
                        onReviewChange={handleReviewChange}
                        onRatingChange={handleRatingChange}
                        onSubmit={handleSubmitReview}
                        isSubmitting={isSubmitting}
                        error={submitError}
                        reservaId={reservaId}
                    />
                </div>
            </section>
        );
    }

    // Caso con reseñas
    return (
        <section id="reviews" className="reviews-section">
            <h2>Reseñas</h2>
            
            {/* Controles fijos que no se moverán */}
            <div className="reviews-controls-fixed">
                <div className="reviews-header">
                    <ReviewStats stats={ratingStats} />
                    
                    <div className="reviews-actions">
                        {renderReviewButton()}
                        
                        {userHasReviewed && (
                            <p className="review-info-message">
                                Ya has dejado tu opinión sobre esta actividad.
                            </p>
                        )}
                        
                        <div className="reviews-filters-container">
                            <Button
                                variant="contained"
                                startIcon={<FilterAltIcon />}
                                onClick={() => {
                                    console.log("Filter button clicked");
                                    toggleFilterSidebar();
                                }}
                                sx={{
                                    borderRadius: "30px",
                                    textTransform: "none",
                                    backgroundColor: "#1C1B1F",
                                    padding: "10px 20px",
                                    marginRight: "10px",
                                }}
                            >
                                Filtrar
                            </Button>
                            
                            <ReviewFilters sortBy={sortBy} onSortChange={setSortBy} />
                        </div>
                        
                        <ReviewModal
                            open={isModalOpen}
                            onClose={handleCloseModal}
                            userData={state.user}
                            review={newReview}
                            onReviewChange={handleReviewChange}
                            onRatingChange={handleRatingChange}
                            onSubmit={handleSubmitReview}
                            isSubmitting={isSubmitting}
                            error={submitError}
                            reservaId={reservaId}
                        />
                    </div>
                </div>
            </div>
            
            {/* Contenido desplazable con sidebar */}
            <div className="reviews-layout">
                {/* Sidebar de filtros (para desktop) */}
                {!isMobile && (
                    <div 
                        className="review-filter-sidebar-container" 
                        ref={sidebarRef}
                        style={{ 
                            visibility: "hidden",
                            display: "none",
                            opacity: 0,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            minHeight: '450px', // Altura mínima fija
                            height: 'auto',    // Permitir crecer
                            width: '280px'
                        }}
                    >
                        <ReviewFilterSidebar
                            isOpen={filterSidebarOpen}
                            onClose={toggleFilterSidebar}
                            ratingFilters={ratingFilters}
                            onRatingFilterChange={handleRatingFilterChange}
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                            isMobile={false}
                        />
                    </div>
                )}

                {/* Modal de filtros (para mobile) */}
                {isMobile && (
                    <>
                        <Backdrop
                            open={filterSidebarOpen}
                            onClick={() => setFilterSidebarOpen(false)}
                            sx={{ zIndex: 1200 }}
                        />
                        <ReviewFilterSidebar
                            isOpen={filterSidebarOpen}
                            onClose={() => setFilterSidebarOpen(false)}
                            ratingFilters={ratingFilters}
                            onRatingFilterChange={handleRatingFilterChange}
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                            isMobile={true}
                        />
                    </>
                )}

                {/* Contenedor principal solo para la lista de reviews */}
                <div 
                    className="reviews-container" 
                    ref={reviewsContainerRef}
                    style={{
                        transform: "translateX(0)",
                        width: "100%"
                    }}
                >
                    <div className="reviews-list">
                        {filteredReviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))}
                        
                        {filteredReviews.length === 0 && Object.values(ratingFilters).some(Boolean) && (
                            <p className="no-filtered-reviews">No hay reseñas que coincidan con los filtros seleccionados.</p>
                        )}
                    </div>

                    {filteredReviews.length > 3 && (
                        <div className="reviews-pagination">
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "30px",
                                    textTransform: "none",
                                    backgroundColor: "#1C1B1F",
                                    padding: "10px 20px",
                                }}
                            >
                                Ver más reseñas
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
