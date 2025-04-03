import React from "react";
import { Link } from "react-router-dom";
import CustomRating from "./CustomRating";
import "../styles/Reviews.css";

const ReviewStats = ({ stats }) => {
	return (
		<div className="rating-summary">
			<div className="average-rating">
				{/* Formateamos el número para mostrar solo 1 decimal */}
				<span className="rating-number">
					{stats.average ? stats.average.toFixed(1) : "0"}/5
				</span>
				<CustomRating value={stats.average} readOnly />
				<span className="total-reviews">{stats.total} reseñas</span>
			</div>

			<div className="rating-bars">
				{stats.distribution.map(({ stars, count }) => (
					<div key={stars} className="rating-bar-row">
						<span>{stars}★</span>
						<div className="rating-bar">
							<div
								className="rating-bar-fill"
								style={{ width: `${(count / stats.total) * 100}%` }}
							/>
						</div>
						<span>{count}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewStats;
