import React from "react";
import { Select, MenuItem } from "@mui/material";
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
      
      {/* Se eliminó el botón duplicado de filtrar que estaba aquí */}
    </div>
  );
};

export default ReviewFilters;
