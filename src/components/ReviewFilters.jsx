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
            backgroundColor: "#FFFFFF", // Fondo blanco
            fontWeight: "bold",
            "&.MuiOutlinedInput-root": {
              border: "1px solid #000000", // Borde negro delgado
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "30px",
              borderColor: "#000000", // Borde negro
              borderWidth: "1px"
            },
            "& .MuiSelect-select": {
              color: "#000000", // Texto negro
              fontWeight: "600"
            },
            "& .MuiSvgIcon-root": {
              color: "#000000" // Icono negro
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000000", 
              borderWidth: "1px"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000000",
              borderWidth: "1px"
            }
          }}
        >
          <MenuItem value="relevant">Más Relevantes</MenuItem>
          <MenuItem value="recent">Más Recientes</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export default ReviewFilters;
