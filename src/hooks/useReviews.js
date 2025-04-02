import { useState, useEffect } from "react";
import { useContextGlobal } from "../gContext/globalContext";

export function useReviews(productoId) {
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
	const [sortBy, setSortBy] = useState("recent");
	const { state } = useContextGlobal();
	const [canReview, setCanReview] = useState(false);
	const [reservaId, setReservaId] = useState(null);

	// Cargar reseñas
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

				if (data && data.resenas) {
					const transformedReviews = transformReviewsData(data.resenas);
					setReviews(transformedReviews);
					setRatingStats(calculateStats(data));
				} else {
					setReviews([]);
					resetStats();
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
		}
	}, [productoId]);

	// Verificar si el usuario puede dejar reseña
	useEffect(() => {
		const checkUserCanReview = async () => {
			if (!state.user || !productoId) return;

			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No hay token disponible para verificar reservas");
					return;
				}

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

					const { tieneReserva, reservaEncontrada } = verificarReservaProducto(
						reservas,
						productoId,
					);

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

	// Enviar una nueva reseña
	const submitReview = async (reviewData) => {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(`/api/reserva/agregar-resena`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(reviewData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.log("Respuesta de error:", response.status, errorText);
				throw new Error(
					`Error al enviar la reseña: ${response.status} ${errorText}`,
				);
			}

			// Recargar las reseñas para mostrar la nueva
			await reloadReviews();
			return true;
		} catch (error) {
			console.error("Error al enviar reseña:", error);
			throw error;
		}
	};

	// Recargar reseñas después de enviar una nueva
	const reloadReviews = async () => {
		try {
			const response = await fetch(`/api/reserva/resenas/${productoId}`);
			if (response.ok) {
				const data = await response.json();
				setReviews(transformReviewsData(data.resenas));
				setRatingStats(calculateStats(data));
			}
			return true;
		} catch (error) {
			console.error("Error al recargar reseñas:", error);
			return false;
		}
	};

	// Funciones de utilidad
	const transformReviewsData = (resenas) => {
		return resenas.map((review) => ({
			id: review.id,
			puntuacion: review.puntuacion,
			comentario: review.resena,
			fechaCreacion: review.fechaResena,
			usuario: {
				nombre: review.nombreUsuario,
				avatarUrl: null,
			},
		}));
	};

	const calculateStats = (data) => {
		return {
			average: data.promedioPuntuacion,
			total: data.totalResenas,
			distribution: [
				{
					stars: 5,
					count: data.resenas.filter((r) => r.puntuacion === 5).length,
				},
				{
					stars: 4,
					count: data.resenas.filter((r) => r.puntuacion === 4).length,
				},
				{
					stars: 3,
					count: data.resenas.filter((r) => r.puntuacion === 3).length,
				},
				{
					stars: 2,
					count: data.resenas.filter((r) => r.puntuacion === 2).length,
				},
				{
					stars: 1,
					count: data.resenas.filter((r) => r.puntuacion === 1).length,
				},
			],
		};
	};

	const resetStats = () => {
		setRatingStats({
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
	};

	const verificarReservaProducto = (reservas, productoId) => {
		let reservaEncontrada = null;
		const tieneReserva = reservas.some((reserva) => {
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

		return { tieneReserva, reservaEncontrada };
	};

	// Ordenar reseñas
	const sortedReviews = Array.isArray(reviews)
		? [...reviews].sort((a, b) => {
				if (sortBy === "recent") {
					return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
				} else {
					return b.puntuacion - a.puntuacion;
				}
			})
		: [];

	return {
		reviews: sortedReviews,
		loading,
		error,
		ratingStats,
		sortBy,
		setSortBy,
		canReview,
		reservaId,
		submitReview,
		reloadReviews,
	};
}
