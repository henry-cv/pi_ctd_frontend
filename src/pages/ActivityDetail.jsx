import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLocationDot,
	faStar as faStarSolid,
	faChevronDown,
	faChevronUp,
	faChevronLeft,
	faChevronRight,
	faArrowLeft,
	faClock,
	faCalendarCheck,
	faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as IoIcons from "react-icons/io5";
import FlashlightOnIcon from "@mui/icons-material/FlashlightOn";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SchoolIcon from "@mui/icons-material/School";
import KayakingIcon from "@mui/icons-material/Kayaking";
import InsightsIcon from "@mui/icons-material/Insights";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FaGlobe, FaStar } from "react-icons/fa";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";
import ButtonGral from "../components/ButtonGral";
import "../css/pages/ActivityDetail.css";
import DurationInfo from "../components/DurationInfo";
import ImageViewer from "../components/ImageViewer";
import { useContextGlobal } from "../gContext/globalContext";
import BookingModal from "../components/BookingModal";
import AccessRequiredModal from "../components/AccessRequiredModal";
import Reviews from "../components/Reviews";
import ActivityPolitics from "../components/ActivityPolitics";
import FavoriteButton from "../components/FavoriteButton";
import ShareButton from "../components/ShareButton";
import ShareModal from "../components/ShareModal";
import { handleGoWhatsApp } from "../constants/data/funtionFetchBookings";
import { WhatsappIcon } from "react-share";
import { normalizeDate } from "../constants/data/funtionsBookingCalendar"
import { useReviews } from "../hooks/useReviews";
import { separateDays } from "../constants/data/funtionsActivityDetail";
import { formatFecha } from "../constants/data/funtionFetchBookings";
// Define MUI icon mapping
const muiIcons = {
	FlashlightOnIcon: FlashlightOnIcon,
	SelfImprovementIcon: SelfImprovementIcon,
	SchoolIcon: SchoolIcon,
	KayakingIcon: KayakingIcon,
	InsightsIcon: InsightsIcon,
};

const ActivityDetail = () => {
	const { state, dispatch } = useContextGlobal();
	const { id } = useParams();
	const [activity, setActivity] = useState(null);
	const [expandedDescription, setExpandedDescription] = useState(false);
	const [showImageViewer, setShowImageViewer] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showMobileBooking, setShowMobileBooking] = useState(false);
	const galleryRef = useRef(null);
	const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0);
	const [isMobileView, setIsMobileView] = useState(false);
	const [openBooking, setOpenBooking] = useState(false);
	const [disponibilidad, setDisponibilidad] = useState([]);
	const [openShareModal, setOpenShareModal] = useState(false);
	const [isPastDate, setIsPastDate] = useState(null);
	const [isBooking, setIsBooking] = useState(false);
	const { ratingStats } = useReviews(id);


	const dateActivity = formatFecha(disponibilidad[0]?.fechaEvento)

	// console.log("La reserva: " + JSON.stringify(state.reservation));
	//  console.log("La activity " + JSON.stringify(state.activity));

	console.log("el efecto ", isPastDate);

	useEffect(() => {
		const fetchActivityDetails = async () => {
			try {
				setLoading(true);

				// Fetch de los detalles del producto
				const response = await fetch(`/api/producto/${id}`);
				if (!response.ok) {
					throw new Error(
						`Error en la solicitud de producto: ${response.status}`,
					);
				}
				const data = await response.json();
				setActivity(data);

				console.log("la cancelación", data.politicaCancelacion);

				try {
					const disponibilidadResponse = await fetch(
						`/api/disponibilidad/${id}`,
					);

					if (disponibilidadResponse.ok) {
						const disponibilidadData = await disponibilidadResponse.json();
						if (Array.isArray(disponibilidadData)) {
							setDisponibilidad(disponibilidadData);
							// console.log("Detalles de disponibilidad:", disponibilidadData);
							const theActivity = { ...disponibilidadData, ...data };
							dispatch({
								type: "SET_ACTIVITY",
								payload: { theActivity },
							});
						} else {
							console.warn("Advertencia: La disponibilidad no es un array");
							setDisponibilidad([]);
						}
					} else {
						console.warn(
							`Advertencia: No se encontró disponibilidad para el ID ${id}`,
						);
						setDisponibilidad([]);
					}
				} catch (disponibilidadError) {
					console.warn(
						"Error al obtener disponibilidad:",
						disponibilidadError.message,
					);
					setDisponibilidad([]);
				}
			} catch (error) {
				console.error("Error al obtener detalles del producto:", error.message);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchActivityDetails();
	}, [id]);


	useEffect(() => {
		if (state.activity?.theActivity) {
			const today = normalizeDate(new Date());
			let theActivity = state.activity.theActivity;
			let isPastEvent = true;

			Object.keys(theActivity)
				.filter((key) => !isNaN(parseInt(key)))
				.forEach((key) => {
					let eventDate = theActivity[key].fechaEvento;
				
					if (eventDate) {
						eventDate = normalizeDate(new Date(eventDate + "T00:00:00"));
						
						if (eventDate > today) {
							isPastEvent = false;
							return;
						}
					}
				});

			if (isPastEvent) {
				setIsPastDate("Esta actividad no cuenta con fechas disponibles");
			} else {
				setIsPastDate("");
			}
		}
	}, [state.activity?.theActivity]);


	// console.log(state.urlRedirection === location.pathname);

	useEffect(() => {
		if (state.urlRedirection === location.pathname) {
			//   console.log("Abrimos el modal de booking automáticamente");
			handleOpenModalBooking(); // Función que abre el modal
			dispatch({
				type: "SET_URL_REDIRECTION",
				payload: "",
			});
		}
	}, [state.urlRedirection]);

	// Detectar scroll para mostrar la card de reserva en móvil
	useEffect(() => {
		const handleScroll = () => {
			if (galleryRef.current) {
				const galleryBottom = galleryRef.current.getBoundingClientRect().bottom;
				setShowMobileBooking(galleryBottom < window.innerHeight / 0);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	// Detectar si estamos en vista móvil
	useEffect(() => {
		const checkMobileView = () => {
			setIsMobileView(window.innerWidth <= 576);
		};

		checkMobileView();
		window.addEventListener("resize", checkMobileView);

		return () => window.removeEventListener("resize", checkMobileView);
	}, []);

	const diasFormateados = activity?.diasDisponible ? separateDays(activity.diasDisponible) : [];


	const handleOpenImageViewer = (index) => {
		setCurrentImageIndex(index);
		setShowImageViewer(true);
		document.body.style.overflow = "hidden";
	};

	const handleCloseImageViewer = () => {
		setShowImageViewer(false);
		document.body.style.overflow = "auto";
	};

	const handleMobileImageNav = (direction) => {
		if (images.length <= 1) return;

		if (direction === "prev") {
			setCurrentMobileImageIndex((prev) =>
				prev === 0 ? images.length - 1 : prev - 1,
			);
		} else {
			setCurrentMobileImageIndex((prev) =>
				prev === images.length - 1 ? 0 : prev + 1,
			);
		}
	};

	const renderStarRating = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating - fullStars >= 0.5;

		for (let i = 1; i <= 5; i++) {
			if (i <= fullStars) {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarSolid}
						className="star filled"
					/>,
				);
			} else if (i === fullStars + 1 && hasHalfStar) {
				stars.push(
					<FontAwesomeIcon
						key={i}
						icon={faStarSolid}
						className="star half-filled"
					/>,
				);
			} else {
				stars.push(
					<FontAwesomeIcon key={i} icon={faStarRegular} className="star" />,
				);
			}
		}
		return stars;
	};

	const getIconComponent = (iconName) => {
		if (!iconName) return FaStar;

		// Check for Font Awesome (FA) icons
		if (iconName.startsWith("Fa") && !iconName.startsWith("Fa6")) {
			return iconName in FaIcons ? FaIcons[iconName] : FaStar;
		}

		if (
			iconName.startsWith("Fa6") ||
			(iconName.startsWith("Fa") && !(iconName in FaIcons))
		) {
			const fa6Name = iconName.startsWith("Fa6")
				? iconName.substring(3)
				: iconName;
			return fa6Name in Fa6Icons ? Fa6Icons[fa6Name] : FaStar;
		}

		if (iconName.startsWith("Io")) {
			return iconName in IoIcons ? IoIcons[iconName] : FaStar;
		}

		if (iconName.endsWith("Icon")) {
			return iconName in muiIcons ? muiIcons[iconName] : FaStar;
		}

		return FaStar;
	};

	const defaultImage = "/activitie.webp";

	const handleImageError = (e) => {
		e.target.src = defaultImage;
	};

	const handleOpenModalBooking = (id) => {
		setIsBooking(false)
		setOpenBooking(true);
	};

	const handleCloseModalBooking = () => {
		setOpenBooking(false);
	};

	const handleOpenShareModal = () => {
		setOpenShareModal(true);
	};

	const handleCloseShareModal = () => {
		setOpenShareModal(false);
	};

	const handleScrollToReviews = (e) => {
		e.preventDefault();
		const reviewsSection = document.getElementById('reviews');
		if (reviewsSection) {
			reviewsSection.scrollIntoView({ behavior: 'smooth' });
		}
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loader"></div>
				<p>Cargando detalles...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error-container">
				<h2>Error al cargar la actividad</h2>
				<p>{error}</p>
				<ButtonGral
					text="Volver a intentar"
					onClick={() => window.location.reload()}
				/>
			</div>
		);
	}

	if (!activity) {
		return (
			<div className="error-container">
				<h2>Actividad no encontrada</h2>
				<p>La actividad que buscas no existe o ha sido eliminada.</p>
				<ButtonGral text="Volver al inicio" url="/" />
			</div>
		);
	}

	// Eliminamos la preparación de elementos para breadcrumbs

	const formatReviewText = (count) => {
		if (count === 1) return "1 reseña";
		return `${count} reseñas`;
	};

	// Preparar las imágenes
	const images =
		activity.productoImagenesSalidaDto?.map((img) => img.rutaImagen) || [];

	return (
		<div className="activity-detail-container">
			{/* Sección principal */}
			<main className="activity-main">
				<BasicBreadcrumbs />

				{/* Galería de imágenes */}
				<section className="gallery-section" ref={galleryRef}>
					<div className="content-wrapper">
						<div
							className={`gallery-grid ${images.length === 1 ? "single-image" : ""
								}`}
						>
							<div
								className="main-image"
								onClick={() => !isMobileView && handleOpenImageViewer(0)}
							>
								{/* Botón de regreso en móvil */}
								{isMobileView && (
									<button
										className="back-button"
										onClick={(e) => {
											e.stopPropagation();
											window.history.back();
										}}
										aria-label="Regresar"
									>
										<FontAwesomeIcon icon={faArrowLeft} />
									</button>
								)}
								<img
									src={
										isMobileView
											? images[currentMobileImageIndex] || defaultImage
											: images[0] || defaultImage
									}
									alt={activity.nombre}
									onError={handleImageError}
								/>

								{/* Botones de navegación para móvil */}
								{isMobileView && images.length > 1 && (
									<>
										<button
											className="mobile-gallery-nav prev"
											onClick={(e) => {
												e.stopPropagation();
												handleMobileImageNav("prev");
											}}
											aria-label="Imagen anterior"
										>
											<FontAwesomeIcon icon={faChevronLeft} />
										</button>
										<button
											className="mobile-gallery-nav next"
											onClick={(e) => {
												e.stopPropagation();
												handleMobileImageNav("next");
											}}
											aria-label="Imagen siguiente"
										>
											<FontAwesomeIcon icon={faChevronRight} />
										</button>
									</>
								)}
							</div>
							<div className="thumbnail-grid">
								{/* Renderizamos las imágenes disponibles primero */}
								{images.slice(1, 5).map((image, index) => (
									<div
										key={index}
										className={`thumbnail ${index === 3 && images.length > 5 ? "with-overlay" : ""
											}`}
										onClick={() => handleOpenImageViewer(index + 1)}
									>
										<img
											src={image}
											alt={`${activity.nombre} - imagen ${index + 1}`}
											onError={handleImageError}
										/>
										{index === 3 && images.length > 5 && (
											<div className="more-images-overlay">
												<span>+{images.length - 5}</span>
											</div>
										)}
									</div>
								))}

								{/* Añadimos contenedores vacíos si no hay 4 imágenes en la columna */}
								{/* {[...Array(Math.max(0, 4 - images.slice(1, 5).length))].map((_, index) => (
                  <div 
                    key={`empty-${index}`}
                    className={`thumbnail empty ${state.theme || ''}`}
                  ></div>
                ))} */}
							</div>
						</div>
					</div>
				</section>

				{/* Información del producto */}
				<section className="detail-section">
					<div className="content-wrapper">
						<div className="detail-grid">
							{/* Columna izquierda: detalles principales */}
							<div className="detail-column">
								<div className="activity-detail-header">
									<div className="activity-detail-title">
										<h1>{activity.nombre}</h1>
										<div className="location-info">
											<FontAwesomeIcon
												icon={faLocationDot}
												className="location-icon"
											/>
											<span>
												{activity.ciudad || "Ciudad"}, {activity.pais || "País"}
											</span>
										</div>
									</div>
									<div className="action-buttons">
										<FavoriteButton productoId={activity.id} />
										<ShareButton onClick={handleOpenShareModal} />
									</div>
								</div>

								<div className="categories-detail">
									{activity.categorias.length > 0 && (
										<>
											<h4>Categorias:</h4>
											{activity.categorias.map((categoria, index) => (
												<span key={index}>
													{categoria.nombre}
													{index !== activity.categorias.length - 1
														? ", "
														: "."}
												</span>
											))}
										</>
									)}
								</div>

								<div className="rating-section">
									<div className="stars-container">
										{renderStarRating(ratingStats.average || 0)}
										<span className="rating-value">
											({ratingStats.average ? ratingStats.average.toFixed(1) : '0'}/5)
										</span>
									</div>
									<a href="#reviews" className="reviews-link" onClick={handleScrollToReviews}>
										{formatReviewText(ratingStats.total || 0)}
									</a>
								</div>

								<div className="description-section">
									<p className={expandedDescription ? "expanded" : ""}>
										{activity.descripcion}
									</p>
									{activity.descripcion &&
										activity.descripcion.length > 200 && (
											<button
												className="expand-button"
												onClick={() =>
													setExpandedDescription(!expandedDescription)
												}
											>
												{expandedDescription ? "Ver menos" : "Ver más"}
												<FontAwesomeIcon
													icon={
														expandedDescription ? faChevronUp : faChevronDown
													}
												/>
											</button>
										)}
								</div>

								<div className="experience-section">
									<h2>Sobre la experiencia</h2>
									<ActivityPolitics
										cancelation={activity.politicaCancelacion}
										payment={activity.politicaPagos}
									/>

									<div className="experience-details">
										<div className="detail-item">

											<div>
												{activity.tipoEvento === "RECURRENTE" ?
													<div className="detail-item">
														<FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
														<div>
															<h3>Días Disponibles</h3>
															{diasFormateados.map((dia, index) => (
																<p key={index}> *{dia.charAt(0).toUpperCase() + dia.slice(1).toLowerCase()}</p>
															))}


														</div>

													</div>

													:
													<>
														<div className="detail-item">
															<FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
															<div>
																<h3>Fecha Unica</h3>
																<p>{dateActivity}  </p>
															</div>
														</div>

													</>}

											</div>
										</div>
										{activity.tipoEvento === "RECURRENTE" ?
											<div className="detail-item">
												<FontAwesomeIcon icon={faClock} className="detail-icon" />
												<div>
													<h3>Horario</h3>
													<p>{activity.horaInicio.slice(0, 5) || "Horario no disponible"} - {activity.horaFin.slice(0, 5) || "Horario no disponible"}</p>
												</div>
											</div> :

											<div className="detail-item">
												<FontAwesomeIcon icon={faClock} className="detail-icon" />
												<div>
													<h3>Duración</h3>
													<p>
														<DurationInfo
															tipoEvento={activity.tipoEvento}
															horaInicio={activity.horaInicio}
															horaFin={activity.horaFin}
															diasDisponible={activity.diasDisponible}
														/>
													</p>

												</div>

											</div>


										}



										<div className="detail-item">
											<FaGlobe className="detail-icon" />
											<div>
												<h3>Idioma</h3>
												<p>{activity.idioma || "Español"}</p>
											</div>
										</div>

										<div className="feature-detail">
											<h2>Servicios y comodidades:</h2>
											{activity.caracteristicas.map((caracteristica, index) => {
												// Get the correct icon component based on the icon name
												const IconComponent = getIconComponent(
													caracteristica.icono,
												);

												return (
													<p key={index} className="feature-item">
														<span>
															<IconComponent />
														</span>
														{caracteristica.nombre}
														{index !== activity.caracteristicas.length - 1
															? ", "
															: "."}
													</p>
												);
											})}
										</div>

										<div className="contact-detail">
											<p>¿Necesitas más información sobre esta actividad?</p>
											<ButtonGral
												text="Escríbele al organizador"
												color="blue" icon={<WhatsappIcon
													size={32}
													round bgStyle={{ fill: "#25D366" }}
													iconFillColor="#000000" />}
												onClick={() => handleGoWhatsApp(activity.telefono ? activity.telefono : 3005223014)}
											/>
										</div>

									</div>
								</div>
							</div>

							{/* Columna derecha: booking card */}
							<div className="booking-column">
								<div className="booking-card">
									<div className="price-section">
										<p style={{ color: "red" }}>{isPastDate}</p>
										<span className="price">${activity.valorTarifa || 0}</span>
										<span className="price-type">
											{activity.tipoTarifa === "POR_PERSONA"
												? "por persona"
												: activity.tipoTarifa === "POR_PAREJA"
													? "por pareja"
													: activity.tipoTarifa === "POR_GRUPO_6"
														? "por grupo (6 personas)"
														: activity.tipoTarifa === "POR_GRUPO_10"
															? "por grupo (10 personas)"
															: ""}
										</span>
										<p className="price-note">
											(el precio incluye impuestos y tarifas de reservación)
										</p>
									</div>
									<ButtonGral
										text="Ver disponibilidad"
										variant="primary"
										color="blue"
										fullWidth={true}
										url={`/reserva/${activity.id}`}
										onClick={() => handleOpenModalBooking(activity.id)}
										disabled={isPastDate ? true : false}
										otherClass={isPastDate ? " disiabled" : ""}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Sección de Reseñas */}
				<Reviews productoId={activity.id} />
			</main>

			{/* Mobile booking card flotante */}
			{showMobileBooking && (
				<div className="mobile-booking-card">
					<div className="mobile-price">
						<span className="price">${activity.valorTarifa || 0}</span>
						<span className="price-type">
							{activity.tipoTarifa === "POR_PERSONA"
								? "por persona"
								: "por grupo"}
						</span>
					</div>
					<ButtonGral
						text="Ver disponibilidad"
						variant="primary"
						color="blue"
						fullWidth={true}
						// url={`/reserva/${activity.id}`}
						onClick={() => handleOpenModalBooking(activity.id)}
					/>
				</div>
			)}

			<BookingModal
				open={openBooking}
				handleClose={handleCloseModalBooking}
				activityId={activity.id}
				isBooking={isBooking}
				setIsBooking={setIsBooking}
			/>

			{/* <AccessRequiredModal open={openAccess} onClose={handleCloseAccess} /> */}
			{/* Visor de imágenes */}
			{showImageViewer && !isMobileView && (
				<ImageViewer
					images={images}
					currentIndex={currentImageIndex}
					onClose={handleCloseImageViewer}
				/>
			)}
			<ShareModal
				open={openShareModal}
				onClose={handleCloseShareModal}
				activity={activity}
				image={images[0] || defaultImage}
			/>
		</div>
	);
};

export default ActivityDetail;
