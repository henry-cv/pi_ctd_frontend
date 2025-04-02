import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import CustomRating from "./CustomRating";
import CustomAvatar from "./CustomAvatar";
import "../styles/Reviews.css";

const ReviewModal = ({
	open,
	onClose,
	userData,
	review,
	onReviewChange,
	onRatingChange,
	onSubmit,
	isSubmitting,
	error,
	reservaId,
}) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<Modal open={open} onClose={onClose} aria-labelledby="modal-review-title">
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
						src={userData?.avatarUrl || "/default-avatar.png"}
						alt={userData?.nombre || "Usuario"}
						size="medium"
					/>
					<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
						{userData?.nombre} {userData?.apellido}
					</Typography>
				</div>

				{/* Sección de calificación centrada */}
				<div className="rating-section">
					<Typography variant="h4" component="h4">
						¿Cómo puntuarías esta experiencia?
					</Typography>
					<div className="rating-input">
						<CustomRating
							value={review.puntuacion || 0}
							onChange={onRatingChange}
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
					value={review.comentario}
					onChange={onReviewChange}
					fullWidth
					margin="normal"
					variant="outlined"
				/>

				{error && (
					<Typography
						color="error"
						variant="body2"
						sx={{ mt: 1, textAlign: "center" }}
					>
						{error}
					</Typography>
				)}

				<div className="review-modal-actions">
					<Button
						onClick={onClose}
						variant="outlined"
						className="cancel-button"
					>
						Cancelar
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={isSubmitting || !reservaId}
						className="publish-button"
					>
						{isSubmitting ? "Publicando..." : "Publicar"}
					</Button>
				</div>
			</Box>
		</Modal>
	);
};

export default ReviewModal;
