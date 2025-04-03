import React from "react";
import { Stack } from "@mui/material";
import CustomRating from "./CustomRating";
import CustomAvatar from "./CustomAvatar";
import "../styles/Reviews.css";

const ReviewItem = ({ review }) => {
	return (
		<div className="review-card">
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
	);
};

export default ReviewItem;
