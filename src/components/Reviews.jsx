import React, { useState, useEffect } from "react";
import {
	Stack,
	Button,
	Select,
	MenuItem,
	Modal,
	Box,
	TextField,
	Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CustomRating from "./CustomRating";
import CustomAvatar from "./CustomAvatar";
import "../styles/Reviews.css";
import { useContextGlobal } from "../gContext/globalContext";

const Reviews = ({ productoId }) => {
	const [sortBy, setSortBy] = useState("recent");
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [ratingStats, setRatingStats] = useState({
		average: 0,
		total: 0,
		distribution: [
			{ stars: 5, count: 0 },
			{ stars: 4, count: 0 },
			{ stars: 3, count: 0 },
			{ stars: 2, count: 0 },
			{ stars: 1, count: 0 },
		],
	});

	// Nuevos estados para la funcionalidad de reseñas - Corregido
	const { state } = useContextGlobal();
	const [canReview, setCanReview] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newReview, setNewReview] = useState({
		puntuacion: 5,
		comentario: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [reservaId, setReservaId] = useState(null);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				console.log(`Obteniendo reseñas para actividad ID: ${productoId}`);
				setLoading(true);
				const response = await fetch(`/api/reserva/resenas/${productoId}`);

				console.log(`Respuesta API status: ${response.status}`);
				if (!response.ok) {
					throw new Error(`Error al obtener reseñas: ${response.status}`);
				}

				const data = await response.json();
				console.log("Datos recibidos de la API:", data);

				// Extraer el array de reseñas y adaptarlo al formato esperado
				const reviewsArray = Array.isArray(data.resenas)
					? data.resenas.map((r) => ({
							id: r.id || Math.random().toString(36).substring(2, 9), // Generar ID si no existe
							usuario: {
								nombre: r.nombreUsuario || "Usuario",
								avatarUrl: r.avatarUrl,
							},
							puntuacion: r.puntuacion,
							comentario: r.resena,
							fechaCreacion: r.fechaResena,
						}))
					: [];

				console.log("Reviews array después de transformar:", reviewsArray);
				setReviews(reviewsArray);

				// Calcular estadísticas de calificación usando los datos adaptados
				if (reviewsArray.length > 0) {
					const total = reviewsArray.length;
					// También podríamos usar directamente data.promedioPuntuacion y data.totalResenas
					// si queremos confiar en los cálculos del backend
					const sum = reviewsArray.reduce(
						(acc, review) => acc + review.puntuacion,
						0,
					);
					const average = Math.round((sum / total) * 10) / 10;

					const distribution = [5, 4, 3, 2, 1].map((stars) => ({
						stars,
						count: reviewsArray.filter(
							(review) => Math.floor(review.puntuacion) === stars,
						).length,
					}));

					setRatingStats({
						average,
						total,
						distribution,
					});
				}
			} catch (error) {
				console.error("Error al cargar reseñas:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (productoId) {
			fetchReviews();
		} else {
			console.warn("No se proporcionó un ID de producto para obtener reseñas");
		}
	}, [productoId]);

	// Verificar si el usuario puede dejar una reseña
	useEffect(() => {
		const checkUserCanReview = async () => {
			if (!state.user || !productoId) return;

			try {
				// Obtener el token de autenticación
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No hay token disponible para verificar reservas");
					return;
				}

				// Obtener todas las reservas del usuario
				const response = await fetch(
					`/api/reserva/usuario/${state.user.email}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				console.log(`Verificando reservas: status ${response.status}`);

				if (response.ok) {
					const reservas = await response.json();
					console.log("Reservas del usuario:", reservas);

					// Verificar si alguna reserva corresponde al productoId actual
					let reservaEncontrada = null;
					const tieneReserva = reservas.some((reserva) => {
						// Comprobar en diferentes ubicaciones posibles del ID del producto
						const productoIdEnReserva =
							reserva.productoId === parseInt(productoId) ||
							reserva.disponibilidadProductoId === parseInt(productoId) ||
							reserva.disponibilidadProductoSalidaDto?.productoId ===
								parseInt(productoId);

						if (productoIdEnReserva) {
							reservaEncontrada = reserva;
						}

						console.log(
							`Reserva ID: ${reserva.id}, ¿Coincide con producto ${productoId}?: ${productoIdEnReserva}`,
						);
						return productoIdEnReserva;
					});

					if (reservaEncontrada) {
						console.log(
							`Reserva encontrada para dejar reseña: ID ${reservaEncontrada.id}`,
						);
						setReservaId(reservaEncontrada.id);
					}

					console.log(
						`¿Usuario puede dejar reseña para producto ${productoId}?: ${tieneReserva}`,
					);
					setCanReview(tieneReserva);
				} else {
					console.error(
						`Error ${response.status}: No se pudo obtener las reservas del usuario`,
					);
				}
			} catch (error) {
				console.error(
					"Error al verificar si el usuario puede dejar reseña:",
					error,
				);
			}
		};

		checkUserCanReview();
	}, [productoId, state.user]);

	// Manejar la apertura del modal
	const handleOpenModal = () => {
		if (!canReview || !state.user) {
			alert("Solo puedes escribir una reseña si has reservado esta actividad.");
			return;
		}
		setIsModalOpen(true);
	};

	// Manejar el cierre del modal
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setNewReview({
			puntuacion: 5,
			comentario: "",
		});
		setSubmitError(null);
	};

	// Manejar cambios en el formulario de reseña
	const handleReviewChange = (e) => {
		setNewReview({
			...newReview,
			[e.target.name]: e.target.value,
		});
	};

	// Manejar cambio en la calificación
	const handleRatingChange = (event, newValue) => {
		setNewReview({
			...newReview,
			puntuacion: newValue,
		});
	};

	// Enviar la nueva reseña
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

			const token = localStorage.getItem("token");

			// Estructura según el esquema que muestra la API, incluyendo reservaId
			const reviewData = {
				puntuacion: parseInt(newReview.puntuacion),
				resena: newReview.comentario,
				reservaId: reservaId,
			};

			console.log("Enviando datos de reseña:", reviewData);

			const response = await fetch(`/api/reserva/agregar-resena`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(reviewData),
			});

			// Verificar y manejar errores de manera más detallada
			if (!response.ok) {
				const errorText = await response.text();
				console.log("Respuesta de error:", response.status, errorText);
				throw new Error(
					`Error al enviar la reseña: ${response.status} ${errorText}`,
				);
			}

			// Actualizar la lista de reseñas después de enviar
			const fetchReviewsResponse = await fetch(
				`/api/reserva/resenas/${productoId}`,
			);
			const data = await fetchReviewsResponse.json();

			const reviewsArray = Array.isArray(data.resenas)
				? data.resenas.map((r) => ({
						id: r.id || Math.random().toString(36).substring(2, 9),
						usuario: {
							nombre: r.nombreUsuario || "Usuario",
							avatarUrl: r.avatarUrl,
						},
						puntuacion: r.puntuacion,
						comentario: r.resena,
						fechaCreacion: r.fechaResena,
					}))
				: [];

			setReviews(reviewsArray);

			// Recalcular las estadísticas
			if (reviewsArray.length > 0) {
				const total = reviewsArray.length;
				const sum = reviewsArray.reduce(
					(acc, review) => acc + review.puntuacion,
					0,
				);
				const average = Math.round((sum / total) * 10) / 10;

				const distribution = [5, 4, 3, 2, 1].map((stars) => ({
					stars,
					count: reviewsArray.filter(
						(review) => Math.floor(review.puntuacion) === stars,
					).length,
				}));

				setRatingStats({
					average,
					total,
					distribution,
				});
			}

			// Cerrar modal y limpiar formulario
			handleCloseModal();
		} catch (error) {
			console.error("Error al enviar reseña:", error);
			setSubmitError(error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Ordenar reseñas según el criterio seleccionado - Protegemos contra valores no iterables
	const sortedReviews = Array.isArray(reviews)
		? [...reviews].sort((a, b) => {
				if (sortBy === "recent") {
					return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
				} else {
					// relevante
					return b.puntuacion - a.puntuacion;
				}
			})
		: [];

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

	if (!reviews || !reviews.length || reviews.length === 0) {
		return (
			<section className="reviews-section">
				<h2>Reseñas</h2>
				<p className="no-reviews-message">
					Esta actividad no cuenta con opiniones disponibles.
				</p>

				{/* Añadir el botón para escribir reseña */}
				<div className="reviews-actions" style={{ marginTop: "20px" }}>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleOpenModal}
						disabled={!canReview || !state.user}
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
						Escribir una opinión
					</Button>

					{/* Modal para escribir una reseña */}
					<Modal
						open={isModalOpen}
						onClose={handleCloseModal}
						aria-labelledby="modal-review-title"
					>
						<Box className="review-modal">
							{/* El código del modal se mantiene igual */}
							<Typography
								id="modal-review-title"
								variant="h6"
								component="h2"
								sx={{ mb: 2 }}
							>
								Escribir una opinión
							</Typography>

							{/* Avatar y nombre del usuario */}
							<div className="user-review-info">
								<CustomAvatar
									src={state.user?.avatarUrl || "/default-avatar.png"}
									alt={state.user?.nombre || "Usuario"}
									size="medium"
								/>
								<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
									{state.user?.nombre} {state.user?.apellido}
								</Typography>
							</div>

							{/* Sección de calificación centrada */}
							<div className="rating-section">
								<Typography variant="h4" component="h4">
									¿Cómo puntuarías esta experiencia?
								</Typography>
								<div className="rating-input">
									<CustomRating
										value={newReview.puntuacion || 0} // Valor 0 para que empiece vacío
										onChange={handleRatingChange}
										precision={1}
										readOnly={false}
										size="large"
									/>
								</div>
							</div>

							<TextField
								className="review-text-field"
								name="comentario"
								label="¿Qué te ha parecido la experiencia?"
								multiline
								rows={4}
								value={newReview.comentario}
								onChange={handleReviewChange}
								fullWidth
								margin="normal"
								variant="outlined"
							/>

							{submitError && (
								<Typography
									color="error"
									variant="body2"
									sx={{ mt: 1, textAlign: "center" }}
								>
									{submitError}
								</Typography>
							)}

							<div className="review-modal-actions">
								<Button
									onClick={handleCloseModal}
									variant="outlined"
									className="cancel-button"
								>
									Cancelar
								</Button>
								<Button
									variant="contained"
									onClick={handleSubmitReview}
									disabled={isSubmitting}
									className="publish-button"
								>
									{isSubmitting ? "Publicando..." : "Publicar"}
								</Button>
							</div>
						</Box>
					</Modal>
				</div>
			</section>
		);
	}

	return (
		<section className="reviews-section">
			<h2>Reseñas</h2>

			<div className="reviews-header">
				<div className="rating-summary">
					<div className="average-rating">
						<span className="rating-number">{ratingStats.average}/5</span>
						<CustomRating value={ratingStats.average} readOnly />
						<span className="total-reviews">{ratingStats.total} reseñas</span>
					</div>

					<div className="rating-bars">
						{ratingStats.distribution.map(({ stars, count }) => (
							<div key={stars} className="rating-bar-row">
								<span>{stars}★</span>
								<div className="rating-bar">
									<div
										className="rating-bar-fill"
										style={{ width: `${(count / ratingStats.total) * 100}%` }}
									/>
								</div>
								<span>{count}</span>
							</div>
						))}
					</div>
				</div>

				<div className="reviews-actions">
					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleOpenModal}
						disabled={!canReview || !state.user}
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
						Escribir una opinión
					</Button>

					{/* Modal para escribir una reseña */}
					<Modal
						open={isModalOpen}
						onClose={handleCloseModal}
						aria-labelledby="modal-review-title"
					>
						<Box className="review-modal">
							<Typography
								id="modal-review-title"
								variant="h6"
								component="h2"
								sx={{ mb: 2 }}
							>
								Escribir una opinión
							</Typography>

							{/* Avatar y nombre del usuario */}
							<div className="user-review-info">
								<CustomAvatar
									src={state.user?.avatarUrl || "/default-avatar.png"}
									alt={state.user?.nombre || "Usuario"}
									size="medium"
								/>
								<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
									{state.user?.nombre} {state.user?.apellido}
								</Typography>
							</div>

							{/* Sección de calificación centrada */}
							<div className="rating-section">
								<Typography variant="h4" component="h4">
									¿Cómo puntuarías esta experiencia?
								</Typography>
								<div className="rating-input">
									<CustomRating
										value={newReview.puntuacion || 0} // Valor 0 para que empiece vacío
										onChange={handleRatingChange}
										precision={1}
										readOnly={false}
										size="large"
									/>
								</div>
							</div>

							<TextField
								className="review-text-field"
								name="comentario"
								label="¿Qué te ha parecido la experiencia?"
								multiline
								rows={4}
								value={newReview.comentario}
								onChange={handleReviewChange}
								fullWidth
								margin="normal"
								variant="outlined"
							/>

							{submitError && (
								<Typography
									color="error"
									variant="body2"
									sx={{ mt: 1, textAlign: "center" }}
								>
									{submitError}
								</Typography>
							)}

							<div className="review-modal-actions">
								<Button
									onClick={handleCloseModal}
									variant="outlined"
									className="cancel-button"
								>
									Cancelar
								</Button>
								<Button
									variant="contained"
									onClick={handleSubmitReview}
									disabled={isSubmitting}
									className="publish-button"
								>
									{isSubmitting ? "Publicando..." : "Publicar"}
								</Button>
							</div>
						</Box>
					</Modal>

					<div className="reviews-filters">
						<div className="reviews-sort">
							<Select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								size="small"
								sx={{
									borderRadius: "30px",
									minWidth: "150px",
									height: "40px",
									"& .MuiOutlinedInput-notchedOutline": {
										borderRadius: "30px",
									},
								}}
							>
								<MenuItem value="relevant">Más Relevantes</MenuItem>
								<MenuItem value="recent">Más Recientes</MenuItem>
							</Select>
						</div>

						<Button
							variant="contained"
							startIcon={<FilterAltIcon />}
							sx={{
								borderRadius: "30px",
								textTransform: "none",
								backgroundColor: "#1C1B1F",
								height: "40px",
								padding: "8px 16px",
							}}
						>
							Filtrar
						</Button>
					</div>
				</div>
			</div>

			<div className="reviews-list">
				{sortedReviews.map((review) => (
					<div key={review.id} className="review-card">
						<div className="review-header">
							<Stack direction="row" spacing={2} alignItems="flex-start">
								<CustomAvatar
									src={review.usuario?.avatarUrl || "/default-avatar.png"}
									alt={review.usuario?.nombre || "Usuario"}
								/>
								<div className="user-info">
									<CustomRating value={review.puntuacion} readOnly />
									<div className="user-details">
										<span className="user-name">
											{review.usuario?.nombre || "Usuario"}
										</span>
										<span className="review-date">
											{new Date(review.fechaCreacion).toLocaleDateString()}
										</span>
									</div>
									<p className="review-comment">{review.comentario}</p>
								</div>
							</Stack>
						</div>
					</div>
				))}
			</div>

			{reviews.length > 3 && (
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
