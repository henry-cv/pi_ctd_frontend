import { useState } from "react";

export function useReviewForm(submitReviewFn, reservaId) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newReview, setNewReview] = useState({
		puntuacion: 5,
		comentario: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	const handleOpenModal = (canReview, user) => {
		if (!user) {
			alert("Debes iniciar sesión para escribir una reseña.");
			return;
		}

		if (!canReview) {
			if (user) {
				alert(
					"No puedes escribir una reseña porque ya has dejado una opinión o no has reservado esta actividad.",
				);
			} else {
				alert(
					"Solo puedes escribir una reseña si has reservado esta actividad.",
				);
			}
			return;
		}

		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setNewReview({
			puntuacion: 5,
			comentario: "",
		});
		setSubmitError(null);
	};

	const handleReviewChange = (e) => {
		setNewReview({
			...newReview,
			[e.target.name]: e.target.value,
		});
	};

	const handleRatingChange = (event, newValue) => {
		setNewReview({
			...newReview,
			puntuacion: newValue,
		});
	};

	const handleSubmitReview = async () => {
		if (!newReview.comentario.trim()) {
			setSubmitError("Por favor escribe un comentario");
			return;
		}

		if (!reservaId) {
			setSubmitError("No se pudo identificar la reserva asociada");
			return;
		}

		try {
			setIsSubmitting(true);
			setSubmitError(null);

			// Estructura según el esquema que espera la API
			const reviewData = {
				puntuacion: parseInt(newReview.puntuacion),
				resena: newReview.comentario,
				reservaId: reservaId,
			};

			console.log("Enviando datos de reseña:", reviewData);

			await submitReviewFn(reviewData);

			// Reseña enviada exitosamente
			console.log("Reseña enviada exitosamente");

			// Cerrar modal y resetear estado
			handleCloseModal();
		} catch (error) {
			console.error("Error al enviar reseña:", error);
			setSubmitError(error.message || "Error al enviar la reseña");
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		isModalOpen,
		newReview,
		isSubmitting,
		submitError,
		handleOpenModal,
		handleCloseModal,
		handleReviewChange,
		handleRatingChange,
		handleSubmitReview,
	};
}
