import { useState, useEffect, useMemo } from "react";
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
	// Nuevo estado para rastrear si el usuario ya dejó una reseña
	const [userHasReviewed, setUserHasReviewed] = useState(false);

	// Un solo efecto para cargar reseñas y verificar si el usuario puede dejar reseña
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);

			try {
				// Paso 1: Cargar las reseñas
				console.log(`Obteniendo reseñas para actividad ID: ${productoId}`);
				const reviewsResponse = await fetch(`/api/reserva/resenas/${productoId}`);
				console.log(`Respuesta API status: ${reviewsResponse.status}`);

				let yaDejoResena = false;

				if (reviewsResponse.ok) {
					const data = await reviewsResponse.json();
					console.log("Datos recibidos de la API:", data);

					if (data && data.resenas) {
						const transformedReviews = transformReviewsData(data.resenas);
						setReviews(transformedReviews);
						setRatingStats(calculateStats(data));

						// Verificar si el usuario actual ya dejó una reseña
						if (state.user) {
							const userFullName = `${state.user.nombre} ${state.user.apellido}`.trim();
							console.log("Nombre completo del usuario actual:", userFullName);

							yaDejoResena = data.resenas.some(review => {
								const matches = review.nombreUsuario &&
									review.nombreUsuario.toLowerCase().includes(state.user.nombre.toLowerCase());

								if (matches) {
									console.log("¡Coincidencia encontrada! Este usuario ya dejó una reseña");
								}

								return matches;
							});

							setUserHasReviewed(yaDejoResena);
							console.log(`¿Usuario ya dejó reseña para producto ${productoId}?: ${yaDejoResena}`);
						}
					} else {
						setReviews([]);
						resetStats();
					}
				}

				// Paso 2: Si el usuario no ha dejado reseña, verificar si tiene reserva
				if (state.user && !yaDejoResena) {
					const token = localStorage.getItem("token");
					if (!token) {
						console.error("No hay token disponible para verificar reservas");
						return;
					}

					const reservasResponse = await fetch(`/api/reserva/usuario/${state.user.email}`, {
						headers: { Authorization: `Bearer ${token}` }
					});

					console.log(`Verificando reservas: status ${reservasResponse.status}`);

					if (reservasResponse.ok) {
						const reservas = await reservasResponse.json();
						console.log("Reservas del usuario:", reservas);

						const { tieneReserva, reservaEncontrada } = verificarReservaProducto(reservas, productoId);

						if (reservaEncontrada) {
							console.log(`Reserva encontrada para dejar reseña: ID ${reservaEncontrada.id}`);
							setReservaId(reservaEncontrada.id);
						}

						setCanReview(tieneReserva && !yaDejoResena);
						console.log(`¿Usuario puede dejar reseña para producto ${productoId}?: ${tieneReserva && !yaDejoResena}`);
					}
				} else {
					// Si ya dejó reseña, no puede dejar otra
					if (yaDejoResena) {
						console.log("Usuario ya dejó reseña, deshabilitando botón");
						setCanReview(false);
					}
				}
			} catch (error) {
				console.error("Error al cargar datos:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (productoId) {
			loadData();
		}
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
	const sortedReviews = useMemo(() => {
		return Array.isArray(reviews)
		  ? [...reviews].sort((a, b) => {
			  if (sortBy === "recent") {
				return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
			  } else {
				return b.puntuacion - a.puntuacion;
			  }
			})
		  : [];
	  }, [reviews, sortBy]);

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
		userHasReviewed, // Exponer el nuevo estado
	};
}
