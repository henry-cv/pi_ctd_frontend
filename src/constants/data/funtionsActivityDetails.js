import { useState, useEffect, useRef } from "react";
import { useContextGlobal } from "../gContext/globalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as IoIcons from "react-icons/io5";

export const useActivityDetails = (id, setActivity, setDisponibilidad, setLoading, setError, dispatch) => {
    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/producto/${id}`);
                if (!response.ok) throw new Error(`Error en la solicitud de producto: ${response.status}`);
                
                const data = await response.json();
                setActivity(data);

                try {
                    const disponibilidadResponse = await fetch(`/api/disponibilidad/${id}`);
                    if (disponibilidadResponse.ok) {
                        const disponibilidadData = await disponibilidadResponse.json();
                        setDisponibilidad(Array.isArray(disponibilidadData) ? disponibilidadData : []);
                        dispatch({ type: "SET_ACTIVITY", payload: { theActivity: { ...disponibilidadData, ...data } } });
                    } else {
                        setDisponibilidad([]);
                    }
                } catch {
                    setDisponibilidad([]);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivityDetails();
    }, [id]);
};

export const useScrollDetection = (galleryRef, setShowMobileBooking) => {
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
};

export const useMobileViewDetection = (setIsMobileView) => {
    useEffect(() => {
        const checkMobileView = () => setIsMobileView(window.innerWidth <= 576);
        checkMobileView();
        window.addEventListener("resize", checkMobileView);
        return () => window.removeEventListener("resize", checkMobileView);
    }, []);
};

export const handleOpenImageViewer = (index, setCurrentImageIndex, setShowImageViewer) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
    document.body.style.overflow = "hidden";
};

export const handleCloseImageViewer = (setShowImageViewer) => {
    setShowImageViewer(false);
    document.body.style.overflow = "auto";
};

export const handleMobileImageNav = (direction, images, setCurrentMobileImageIndex) => {
    if (images.length <= 1) return;
    setCurrentMobileImageIndex((prev) => direction === "prev" ? (prev === 0 ? images.length - 1 : prev - 1) : (prev === images.length - 1 ? 0 : prev + 1));
};

export const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} className="star filled" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} className="star half-filled" />);
        } else {
            stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} className="star" />);
        }
    }
    return stars;
};

export const getIconComponent = (iconName) => {
    if (!iconName) return FaIcons.FaStar;
    if (iconName.startsWith("Fa") && !iconName.startsWith("Fa6")) return FaIcons[iconName] || FaIcons.FaStar;
    if (iconName.startsWith("Fa6")) return Fa6Icons[iconName.substring(3)] || FaIcons.FaStar;
    if (iconName.startsWith("Io")) return IoIcons[iconName] || FaIcons.FaStar;
    return FaIcons.FaStar;
};

export const defaultImage = "/activitie.webp";
export const handleImageError = (e) => e.target.src = defaultImage;

export const handleOpenModalBooking = (id, state, setOpenAccess, setOpenBooking) => {
    if (!state.token) {
        setOpenAccess(true);
    } else {
        setOpenBooking(true);
    }
};

export const handleCloseModalBooking = (setOpenBooking) => setOpenBooking(false);
export const handleCloseAccess = (setOpenAccess) => setOpenAccess(false);

export const formatReviewText = (count) => count === 1 ? "1 reseña" : `${count} reseñas`;

export const getActivityImages = (activity) => {
    return activity?.productoImagenesSalidaDto?.map((img) => img.rutaImagen) || [];
};