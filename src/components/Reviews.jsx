import React from "react";
import { Button } from "@mui/material";
import "../styles/Reviews.css";
import { useContextGlobal } from "../gContext/globalContext";
import ReviewModal from "./ReviewModal";
import ReviewStats from "./ReviewStats";
import ReviewItem from "./ReviewItem";
import ReviewFilters from "./ReviewFilters";
import { useReviews } from "../hooks/useReviews";
import { useReviewForm } from "../hooks/useReviewForm";

const Reviews = ({ productoId }) => {
	const { state } = useContextGlobal();

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
		userHasReviewed, // Recibir el nuevo estado
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
			<section className="reviews-section">
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

			<div className="reviews-header">
				<ReviewStats stats={ratingStats} />

				<div className="reviews-actions">
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

					<ReviewFilters sortBy={sortBy} onSortChange={setSortBy} />
				</div>
			</div>

			<div className="reviews-list">
				{sortedReviews.map((review) => (
					<ReviewItem key={review.id} review={review} />
				))}
			</div>

			{sortedReviews.length > 3 && (
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
		</section>
	);
};

export default Reviews;
