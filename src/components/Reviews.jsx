import React, { useState, useEffect } from "react";
import { Stack, Button, Select, MenuItem } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CustomRating from "./CustomRating";
import CustomAvatar from "./CustomAvatar";
import "../styles/Reviews.css";

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
						sx={{
							borderRadius: "30px",
							textTransform: "none",
							backgroundColor: "#6749D9",
							padding: "10px 20px",
						}}
					>
						Escribir una opinión
					</Button>

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
