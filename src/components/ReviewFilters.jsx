import React from "react";
import { Select, MenuItem, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "../styles/Reviews.css";

const ReviewFilters = ({ sortBy, onSortChange }) => {
	return (
		<div className="reviews-filters">
			<div className="reviews-sort">
				<Select
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value)}
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
	);
};

export default ReviewFilters;
